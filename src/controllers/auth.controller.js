import User from '../models/user.model.js';  
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createAccessToken } from "../libs/jwt.js";
import mConfirmacion from './mConfirmacion.js';
import { mReestablecer } from './mReestablecer.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { validationResult } from "express-validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth();
    if (month < birthDateObj.getMonth() || (month === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
};
export const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('register', {
            errors: errors.array(),
            formData: req.body, // Mantener los datos del formulario
        });
    }

    const { username, email, password, phoneNumber, address, birthdate } = req.body;

    // Verifica si birthdate está presente
    if (!birthdate) {
        return res.status(400).render('register', {
            errors: [{ msg: 'La fecha de nacimiento es obligatoria' }],
            formData: req.body,
        });
    }

    // Validar que la persona sea mayor de 18 años
    const age = calculateAge(birthdate);
    if (age < 18) {
        return res.status(400).render('register', {
            errors: [{ msg: 'Debes ser mayor de 18 años para registrarte' }],
            formData: req.body,
        });
    }

    try {
        // Crear un usuario de prueba si no existe
        const testUser = await User.findOne({ username: 'test' });

        if (!testUser) {
            const testPasswordHash = await bcrypt.hash('123123', 10);  // Contraseña para el usuario test
            const newTestUser = new User({
                username: 'test',
                email: 'test@test.com',
                password: testPasswordHash,
                phoneNumber: '1234567890',
                address: {
                    street: 'Test Street',
                    city: 'Test City',
                    province: 'Test Province',
                    postalCode: '12345'
                }
            });

            // Guardar el usuario de prueba en la base de datos
            await newTestUser.save();
            console.log('Usuario de prueba creado');
        }

        // Crear el usuario normal (el que se recibe en la solicitud)
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            phoneNumber,
            address,
            birthdate,
        });

        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });
        res.cookie("token", token);

        await mConfirmacion({ body: { name: username, email } }, res);
        res.redirect("/api/login");

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el usuario');
    }
};

// Controlador para mostrar el formulario de registro
export const showRegisterForm = (req, res) => {
    const user = req.session.user || null;  
    res.render("register", { errors: [], formData: {} },); // Mostrar el formulario vacío al inicio
};

export const changePassword = async (req,res) => {
    const {currentPassword,newPassword,confirmPassword} = req.body

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message:"Las contraseñas no coinciden"})
    }
    try {
        const userFound = await User.findById(req.user.id)
        if (!userFound) {
            return res.status(404).json ({message:"Usuario no encontrado"})
        }
        const isMatch = await bcrypt.compare(currentPassword,userFound.password)
        if (!isMatch) {
            return res.status(400).json ({message:"La contraseña actual es incorrecta"})
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        userFound.password = passwordHash
        await userFound.save()
        console.log("NuevaContraseña: "+ newPassword);
        req.session.destroy();
        res.clearCookie("token");  
      
        return res.json({ success: true, message: "Contraseña cambiada con éxito" });


    } catch (error) {
        return res.status(500).json({message: error.message})
    }
};
export const resetPassword = async (req, res) => {

    const { email } = req.body; 
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
    }

    try {
        // Buscar al usuario por el email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Hashear la nueva contraseña
        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
        await user.save();

        // Enviar el correo de confirmación usando mReestablecer
        await mReestablecer({ body: { name: user.username, email } }, res);

        // Redirigir a la página de confirmación de envío de correo
        console.log("Se envio el mail correctamente");
        
        return res.redirect('/api/login');

    } catch (error) {
        console.error('Error al restablecer la contraseña: ', error);
        return res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            // Si el usuario no se encuentra, mostramos un error en la vista
            return res.render('login', {
                errors: [{ msg: "Usuario no encontrado" }]
            });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            // Si la contraseña no coincide, mostramos un error en la vista
            return res.render('login', {
                errors: [{ msg: "Contraseña incorrecta" }]
            });
        }

        // Si el login es correcto, creamos el token y redirigimos
        const token = await createAccessToken({ id: userFound._id });
        req.session.user = {
            id: userFound._id,
            nombre: userFound.nombre,
            email: userFound.email
        };

        res.cookie("token", token);
        res.redirect("/");

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



// controllers/authController.js
export const logout = (req, res) => {
    req.session.destroy();
    res.clearCookie("token");  
    return res.redirect("/");
}



export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id);
        if (!userFound) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Usamos 'res.render' para renderizar la vista y pasar los datos del usuario
        return res.render('profile', {
            user: userFound
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

