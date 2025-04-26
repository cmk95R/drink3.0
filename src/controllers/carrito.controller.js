import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Para resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../db-json/productos.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


const carritoController = {
    carrito: (req, res) => {

        // Filtrar los productos si hay una palabra clave
        

        // Obtener el usuario de la sesión
        const user = req.session.user || null;  // Ajusta esto según cómo guardes el usuario en la sesión

        return res.render('carrito.ejs', {
            products,  // Pasamos los productos filtrados
            toThousand,
            user // Pasamos el objeto 'user' para usarlo en la vista
        });
    }
};

export default carritoController;
