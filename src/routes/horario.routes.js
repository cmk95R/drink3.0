import { Router } from "express";
import {
  renderScheduleMainPage,
 
} from '../controllers/horarios.controller.js';
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Páginas renderizadas (vistas)
router.get('/', authenticate, renderScheduleMainPage); // Página principal de horarios


export default router;