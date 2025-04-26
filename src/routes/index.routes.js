import express from 'express';
import controller from '../controllers/indexController.js';  // Asegúrate de importar correctamente
import detailProduct from '../controllers/detailProduct.js';
const router = express.Router();

//router.post('/', abrirModalCarrito);

router.get('/', controller.index);  // Usa el método correcto del controlador
router.get('/search', controller.index);  // Puedes mantener esta ruta si es necesaria
router.get('/products/detail/:id', detailProduct);  // Aquí se usa la función de controlador.

export default router;
