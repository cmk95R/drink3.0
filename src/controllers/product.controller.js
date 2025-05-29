import mongoose from 'mongoose';
import Product from '../models/product.js';

const validateObjectIdProd = (id) => mongoose.Types.ObjectId.isValid(id);//Encerramos el id del producto

//Función crear producto
export const createProduct = async (req,res)=>{
    try{
        //necesita de las siguientes variables para crearse:
        const{name,price,stock,category,description} = req.body;
        //imagen opcional
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
        return res.status(201).json({ message: 'Producto creado correctamente' });
    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un error, pruebe mas tarde.'});
    }
};

//Obtener los productos por un id //////////////////////////usado por "product.routes" no c si funciona el routes
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

//Funcion actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectIdProd(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const { name, price, stock, category, description } = req.body;
    let isAvailable = req.body.isAvailable === 'on';
    //Obligar a poner todos los campos
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

    res.redirect('/products?edit=success');

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error, pruebe más tarde.' });
  }
};

//Funcion borrar producto
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
        res.redirect('/products'); 
    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un errror, pruebe mas tarde'});
    }
};

//Funcion para renderizar en la página principal 
export const renderProductMainPage = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });  // products.ejs
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar productos');
    }
};
