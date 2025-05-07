import User from '../models/user.js';  

//import jwt from "jsonwebtoken"
//mport { createAccessToken } from "../libs/jwt.js";
// import mConfirmacion from './mConfirmacion.js'; // ❌ Si no vas a usar email de confirmación, comentar
// import { mReestablecer } from './mReestablecer.js'; // ❌ Si no vas a enviar mails de recuperación, comentar
// import path from 'path'; // ❌ Solo necesario para EJS u otras vistas
// import { fileURLToPath } from 'url'; // ❌ Solo necesario para EJS
//import { validationResult } from "express-validator";
import { hashPassword,comparePasswords } from '../services/password.services.js';
import { createAccessToken } from '../services/jwt.service.js';

export const register = async (req,res)=>{
 
    

    try{
        const{name,email,rol,password,edad} = req.body;
        if(!name || !email || !rol || !password || !edad){
            return res.status(400).json({message:'Todos los campos son obligatorios'});

        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword)
        const newUser = new User(
            {
            name, 
            email, 
            rol, 
            password: hashedPassword, 
            edad
        }
    )
    await newUser.save();
    const { password: _, ...userData } = newUser.toObject(); // Excluir password
    res.status(201).json(userData);


        
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error en el registro. Inténtalo más tarde.' });

    }
};


export const login = async(req,res)=>{
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:'Credenciales invalidas'});
        }

        const isMatch = await comparePasswords(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:' Credenciales Invalidas.'});
        }

        const token = createAccessToken({id: user._id, rol: user.rol});
        const {password: _, ...userData} = user.toObject();//Excluir Password
        res.status(200).json({ user: userData, token });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error en el login. Inténtalo más tarde.' });
    }
   
}



export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id);
        if (!userFound) {

            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        //res.render(renderiza una vista)
        //donde se cargara una vista de proyecto del willy
        // res.render/res/ ->
        //scrpit/js cargar elementos del backend
        return res.json({
            user: {
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                address: userFound.address,
                phoneNumber: userFound.phoneNumber
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};














































































































































// const __filename = fileURLToPath(import.meta.url); // ❌ Solo necesario si usás vistas
// const __dirname = path.dirname(__filename); // ❌ Solo necesario si usás vistas

/* 
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
*/





/* 
export const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { name, email, password, rol, birthdate } = req.body;

    if (!birthdate) {
        return res.status(400).json({
            message: 'La fecha de nacimiento es obligatoria'
        });
    }

    const age = calculateAge(birthdate);
    if (age < 18) {
        return res.status(400).json({
            message: 'Debes ser mayor de 18 años para registrarte'
        });
    }

    try {
        // ❌ El usuario de prueba puede comentarse si no lo necesitás
        /*
        const testUser = await User.findOne({ username: 'test' });

        if (!testUser) {
            const testPasswordHash = await bcrypt.hash('123123', 10);
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

            await newTestUser.save();
            console.log('Usuario de prueba creado');
        }
        */
/*
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: passwordHash,
            rol,
            edad: age
        });

        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });
        res.cookie("token", token);

        // await mConfirmacion({ body: { name: username, email } }, res); // ❌ Si no usás confirmación por email
        return res.status(201).json({ message: "Usuario registrado correctamente", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}; 

*/


/*  
// ❌ Solo necesario si vas a renderizar una vista de registro (no para API REST)
export const showRegisterForm = (req, res) => {
    // const user = req.session.user || null;  
    // res.render("register", { errors: [], formData: {} });
};
*/
/*
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

        res.clearCookie("token");  
        return res.json({ success: true, message: "Contraseña cambiada con éxito" });

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}; 
*/

/* 
export const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
        await user.save();
    
        // await mReestablecer({ body: { name: user.username, email } }, res); // ❌ Si no vas a enviar email
        return res.json({ message: 'Contraseña restablecida correctamente.' });

    } catch (error) {
        console.error('Error al restablecer la contraseña: ', error);
        return res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};

*/


/* 
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        const token = await createAccessToken({ id: userFound._id });
        // req.session.user = { id: userFound._id, nombre: userFound.nombre, email: userFound.email }; // ❌ Sesiones no necesarias en JWT puro
        res.cookie("token", token);
        return res.json({ message: "Inicio de sesión exitoso", token });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

*/
/* 
export const logout = (req, res) => {
    // req.session.destroy(); // ❌ No necesario si no usás sesiones
    res.clearCookie("token");  
    return res.json({ message: "Sesión cerrada correctamente" });
}

*/

