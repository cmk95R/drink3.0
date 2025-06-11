import { Router } from "express";
import { renderProductsPage } from '../controllers/product.controller.js';
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Páginas renderizadas (vistas)
router.get('/', authenticate, renderProductsPage); // Listar productos

export default router;