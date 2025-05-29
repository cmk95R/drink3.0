//Importaciones
import Product from '../models/product.js';

// Función para renderizar vista index (exportada al final)
const controller = {
    index: async (req, res) => {
        try {
            //parametro de consulta
            const { keywords } = req.query;
            let products;
            //Filtro de búsqueda (usado en index.ejs)
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
            //Retorna la renderización
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