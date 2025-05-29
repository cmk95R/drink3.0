import { Router } from "express";
import { login, register, profile, showRegisterForm, showLoginForm , logout, resetPassword,changePassword} from "../controllers/auth.controller.js";

import carrito from "../controllers/carrito.controller.js"
import path from 'path';
import { authenticate } from "../middlewares/auth.middleware.js";



const router = Router();


//Ruta para mostrar la pagina de carrito
router.get('/carrito', authenticate, carrito.carrito,(req, res) => {
  res.render('carrito');
});




//router.get("/logout", logout)
router.post('/register', register);
router.get('/register',showRegisterForm)
router.post('/login', login);
router.get('/login', (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
}, showLoginForm);
router.get('/profile', authenticate, profile);
router.post('/change-password', authenticate, changePassword);
router.get('/logout', logout);





export default router;