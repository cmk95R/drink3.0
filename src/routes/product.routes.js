import { Router } from "express";
import {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    renderProductMainPage,
    renderAddProductPage,
    renderEditProductPage,
} from '../controllers/product.controller.js';
import upload from "../middlewares/upload.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Páginas renderizadas (vistas)
router.get('/', authenticate, renderProductMainPage);          // Listar productos
router.get('/add', authenticate, renderAddProductPage);        // Formulario agregar
router.get('/edit/:id', authenticate, renderEditProductPage);  // Formulario editar

// Acciones CRUD
router.post('/add', authenticate, upload.single('image'), createProduct);
router.put('/edit/:id', authenticate, upload.single('image'), updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;