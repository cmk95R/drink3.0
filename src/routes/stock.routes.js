import { Router } from "express";
import { renderStockPage } from '../controllers/product.controller.js';
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Páginas renderizadas (vistas)
router.get('/', authenticate, renderStockPage); // Listar productos

export default router;