//Importaciones
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Para resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../db-json/productos.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/*------funcion renderizar página carrito------*/
const carritoController = {
    carrito: (req, res) => {

        // Obtener el usuario de la sesión
        const user = req.session.user || null;
        // Devuelve la renderizacion de la página
        return res.render('carrito.ejs', {
            products,  // Pasamos los productos filtrados ============= ????????????????????? que productos
            toThousand,
            user // Pasamos el objeto 'user' para usarlo en la vista
        });
    }
};

export default carritoController;
