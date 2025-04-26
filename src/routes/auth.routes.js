import { Router } from "express";
import {login ,register,showRegisterForm,logout,profile, changePassword } from "../controllers/auth.controller.js"
import carrito from "../controllers/carrito.controller.js"
import path from 'path';
import { fileURLToPath } from 'url';
import {authRequired}  from "../middlewares/validateToken.js";
import { validacionesRegister } from "../validations/validacionesRegister.js";
import { validacionesLogin } from "../validations/validacionesLogin.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();



// Ruta para mostrar la pagin de login 
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza la vista login.ejs
});

router.post('/login', validacionesLogin, login);
//Ruta para mostrar la pagina de carrito

router.get('/profile', authRequired, profile,(req, res) => {
    res.sendFile(path.join(__dirname, '../pages/profile.html'));
});

//Ruta para mostrar la pagina de carrito
router.get('/carrito', authRequired, carrito.carrito,(req, res) => {
    res.render('carrito');
});


router.get('/medios-pago', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/medios-pago.html'));
});


// Ruta para mostrar la pagina de confirmacion de Registro
router.get('/confirm', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/confirm.html'));
});

// Ruta para mostrar la pagina de Cambio de Contraseña


router.get('/sistema-notificaciones', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/sistema-notificaciones.html'));
});



//Ruta para procesar el registro 
router.get("/register",  showRegisterForm); // Muestra el formulario sin datos

//Ruta para procesar el registro 
router.post('/register', validacionesRegister,register);


//Ruta para cambiar la pass del usuario 
router.post('/change-password', authRequired, changePassword)



// Otras rutas 



router.get("/logout", logout)




export default router