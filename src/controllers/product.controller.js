import mongoose from 'mongoose';
import Product from '../models/product.js';
import fs from 'fs';
import csv from 'csv-parser'; 
import { url } from 'inspector';


const validateObjectIdProd = (id) => mongoose.Types.ObjectId.isValid(id); // Validar ID

export const uploadProductsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    // 🧠 Obtenemos las categorías válidas desde el enum del schema
    const allowedCategories = Product.schema.path('category').enumValues;

    const filePath = req.file.path;
    const productos = [];
    const invalids = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {

        const { name, stock, category, isAvailable, image } = row;
        const parsedStock = parseInt(stock);

        // Normalizamos la categoría a minúsculas para comparación
        const categoryNormalized = category?.toLowerCase();

        const isValidCategory = allowedCategories.includes(categoryNormalized);
        if (!isValidCategory || !name || isNaN(parsedStock)) {
          invalids.push({ name, category });
          return;
        }

        productos.push({
          name,
          stock: parsedStock,
          category: categoryNormalized,
          isAvailable: isAvailable?.toLowerCase() === 'true',
          image: image?.trim() || null,
        });
      })
      .on('end', async () => {
        try {
          if (productos.length > 0) {
            await Product.insertMany(productos);
          }

          fs.unlinkSync(filePath); // Limpiamos el archivo

          res.status(200).json({
            message: 'Carga finalizada',
            inserted: productos.length,
            invalids,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al guardar los productos' });
        }
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el archivo CSV' });
  }
};

export const createProduct = async (req, res) => {
    try {
        const { name, stock, category, description } = req.body;
        let image = req.file ? req.file.filename : null;
        let isAvailable = req.body.isAvailable === 'on';

        // ✅ Quitamos price de la validación
        if (!name || stock == null || !category) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const newProduct = new Product({
            name,
            stock,
            category,
            description,
            image,
            isAvailable
        });

        await newProduct.save();
        return res.status(201).json({ message: 'Producto creado correctamente' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde.' });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectIdProd(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(product);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
// Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectIdProd(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const { name, stock, category, description } = req.body;
        let isAvailable = req.body.isAvailable === 'on';

        // ✅ Quitamos price de la validación
        if (!name || stock == null || !category) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        let image;
        if (req.file) {
            image = req.file.filename;
        }

        const updateData = {
            name,
            stock,
            category,
            description,
            isAvailable
        };
        if (image) {
            updateData.image = image;
        }

        const update = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!update) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.redirect('/stock?edit=success');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde.' });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectIdProd(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.redirect('/stock');

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde.' });
    }
};

// Renderizar la vista de productos
export const renderProductsPage = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar productos');
    }
};

// Obtener todos los productos
export const renderStockPage = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('stock', { products }); // renderización de página :v
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al obtener los productos');
  }
};

