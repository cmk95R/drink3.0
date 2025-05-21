import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/product.js';

// Para resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const productsFilePath = path.join(__dirname, '../db-json/productos.json');
//const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

//const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
    index: async (req, res) => {
        try {
            const { keywords } = req.query;
            let products;

            if (keywords) {
                // Buscar productos cuyo nombre contenga las keywords (insensible a mayúsculas)
                products = await Product.find({ 
                    name: { $regex: keywords, $options: 'i' } 
                });
            } else {
                // Traer todos los productos
                products = await Product.find();
            }

            const user = req.session.user || null;

            const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            return res.render('index.ejs', {
                products,
                toThousand,
                keywords,
                user
            });

        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al cargar la página principal');
        }
    }
};

export default controller;



