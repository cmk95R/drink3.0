import { Router } from "express";
import { login, register, profile, showRegisterForm, showLoginForm , logout, resetPassword,changePassword} from "../controllers/auth.controller.js";

import carrito from "../controllers/carrito.controller.js"

import { authenticate } from "../middlewares/auth.middleware.js";
import mConfirmacion from "../controllers/mConfirmacion.js";

const router = Router();


//Ruta para mostrar la pagina de carrito
router.get('/carrito', authenticate, carrito.carrito,(req, res) => {
  res.render('carrito');
});

//Rutas de authentication
router.post('/register', register, mConfirmacion);
router.get('/register',showRegisterForm);
router.post('/login', login);
router.get('/login',showLoginForm);
router.get('/profile', authenticate, profile);
router.post('/change-password', authenticate, changePassword);
router.get('/logout', logout);


export default router;