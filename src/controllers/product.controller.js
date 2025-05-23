import mongoose from 'mongoose';
import Product from '../models/product.js';


const validateObjectIdProd = (id) => mongoose.Types.ObjectId.isValid(id);//Encerramos el id del producto


export const createProduct = async (req,res)=>{
    try{
        const{name,price,stock,category,description} = req.body;
        let image = req.file ? req.file.filename : null;

        let isAvailable = req.body.isAvailable === 'on';

        if(!name||price == null || stock == null || !category){
            return res.status(400).json({message:'Todos los campos son obligatoris'})
        }
        

        const newProduct = new Product({
            name,
            price,
            stock,
            category,
            description,
            image,
            isAvailable 
        });
        await newProduct.save();
        //res.render(201).json(newProduct);
        res.render('addProduct', { newProduct }); // ✅ Sin extensión ni barra
    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un error, pruebe mas tarde.'});
    }
};

//Obtener los productos por un id
export const getProductById = async (req,res)=>{
    try{
        const{id} = req.params;
        if (!validateObjectIdProd(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }
        const product = await Product.findById(id);
        
        if(!product){
            return res.status(404).json({message:'Producto no Encontrado'})
        }
        res.status(200).json(product);
    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un error pruebe mas tarde'});
    }
};

export const getAllProducts = async (req,res)=>{
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un error pruebe mas tarde'});
    }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectIdProd(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const { name, price, stock, category, description } = req.body;
    let isAvailable = req.body.isAvailable === 'on';

    if (!name || price == null || stock == null || !category) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Manejo de la imagen
    let image;
    if (req.file) {
      image = req.file.filename; // nueva imagen subida
    }

    // Objeto para update (solo actualizamos image si hay nueva)
    const updateData = {
      name,
      price,
      stock,
      category,
      description,
      isAvailable,
    };

    if (image) {
      updateData.image = image;
    }

    const update = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!update) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Si usas API JSON
    // res.status(200).json(update);

    // Si usas render con EJS para volver a la lista o detalle:
    // res.redirect('/products');

    res.status(200).json(update); // o lo que corresponda

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error, pruebe más tarde.' });
  }
};


export const deleteProduct = async (req,res)=>{
    
    try{
        const{id}=req.params;
        if(!validateObjectIdProd(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }
        const deleted = await Product.findByIdAndDelete(id);
        if(!deleted){
            return res.status(404).json({message:'Producto no encontrado'})
        }
        res.status(204).send();
    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un errror, pruebe mas tarde'});
    }
};


export const renderProductMainPage = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });  // products.ejs
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar productos');
    }
};
// Renderiza formulario para crear producto
export const renderAddProductPage = (req, res) => {
      res.render('addProduct', { newProduct: null });
};

// Renderiza formulario para editar producto (recibe id)
export const renderEditProductPage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectIdProd(id)) {
            return res.status(400).send('ID inválido');
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('editProduct', { product }); // editProduct.ejs con datos
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar producto');
    }
};
