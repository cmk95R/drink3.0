import mongoose from 'mongoose';
import Product from '../models/product.js';


const validateObjectIdProd = (id) => mongoose.Types.ObjectId.isValid(id);//Encerramos el id del producto


export const createProduct = async (req,res)=>{
    try{
        const{name,price,stock,category,description,image,isAvailable} = req.body;

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
            isAvailable : isAvailable ?? true
        });
        await newProduct.save();
        res.status(201).json(newProduct);
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


export const updateProduct = async (req,res)=>{
    
    try{
        const{id}=req.params;
        if(!validateObjectIdProd(id)){
            return res.status(400).json({message:'ID invalido'});
        }
        const{name,price,stock,category,description,image,isAvailable} = req.body;

        const update = await Product.findByIdAndUpdate(
            id,
            {name,price,stock,category,description,image,isAvailable},
            {new:true,runValidators:true }
        );

        if(!update){
            return res.status(404).json({message:'Producto no encontrado'});
        }
        res.status(200).json(update);

    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un error pruebe mas tarde.'})
    }
}

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