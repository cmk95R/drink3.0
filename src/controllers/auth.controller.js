import User from '../models/user.js';  
import { hashPassword,comparePasswords } from '../services/password.services.js';
import { createAccessToken } from '../services/jwt.service.js';


export const showRegisterForm = (req, res) => {
    res.render('register', { formData: {}, errors: [] });
};

export const register = async (req,res)=>{
     const { name, email, rol, password, edad } = req.body;
     const formData = { name, email, rol, edad };
     let errors = [];

      if (!name || !email || !rol || !password || !edad) {
        errors.push({ msg: 'Todos los campos son obligatorios.' });
        return handleResponse(req, res, 400, { errors, formData }, 'register');
  }
    try{        
        const existingUser = await User.findOne({email});
        if (existingUser) {
            errors.push({ msg: 'El correo ya está registrado.' });
            return handleResponse(req, res, 400, { errors, formData }, 'register');
          }

          const hashedPassword = await hashPassword(password);
          const newUser = new User({ name, email, rol, password: hashedPassword, edad });        
    
    await newUser.save();
    //const { password: _, ...userData } = newUser.toObject(); // Excluir password
    if (req.accepts('html')) {
      return res.redirect('/auth/profile');
    } else {
      const { password: _, ...userData } = newUser.toObject();
      return res.status(201).json(userData);
    }
        
    }catch(error){
        console.error(error);
        errors.push({ msg: 'Error en el registro. Inténtalo más tarde.' });
        return handleResponse(req, res, 500, { errors, formData }, 'register');

    }
};
///////////////////////////////////////////////////////////////////////////////
export const showLoginForm = (req, res) => {
    res.render('index', { error: null });
  };
///////////////////////////////////////////////////////////////////////////////  

export const login = async (req, res) => {
    const { email, password } = req.body;

    let invalidFields = [];

    // Verificar si faltan campos
    if (!email) invalidFields.push('email');
    if (!password) invalidFields.push('password');

    if (invalidFields.length > 0) {
        return handleResponse(req, res, 400, {
            error: 'Email y contraseña son requeridos.',
            invalidFields
        }, 'index');
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return handleResponse(req, res, 400, { 
            error: 'Introduce un correo válido.', 
            invalidFields: ['email'] 
        }, 'index');
    }

    try {
        const user = await User.findOne({ email });

        // Si no existe el usuario o la contraseña no coincide,
        // marcar ambos campos como inválidos
        if (!user || !(await comparePasswords(password, user.password))) {
            return handleResponse(req, res, 401, { 
                error: 'Credenciales inválidas.', 
                invalidFields: ['email', 'password'] 
            }, 'index');
        }

        const token = createAccessToken({ id: user._id, rol: user.rol });

        req.session.user = {
            id: user._id,
            name: user.name,
            rol: user.rol,
            pro: user.pro,
            email: user.email
        };

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        const { password: _, ...userData } = user.toObject();

        if (req.accepts('html')) {
            return res.redirect(user.rol === 'cliente' ? '/dashboard' : '/stock');
        } else {
            return res.status(200).json({ token, user: userData });
        }
    } catch (error) {
        console.error(error);
        return handleResponse(req, res, 500, { error: 'Error interno del servidor.' }, 'login');
    }
};


export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) {
      // Si el usuario no se encuentra (ej. fue eliminado), destruir sesión y redirigir al login
      req.session.destroy();
      res.clearCookie('token', { httpOnly: true, secure: false });
      return res.redirect('/auth/login');
    }

    let dataToRender = {
      user: userFound,
      formData: {},     // ✅ Esto evita el error en el EJS
      errors: []        // ✅ Por si el EJS también los usa
    };

    // Si el usuario es admin, obtener la lista de todos los usuarios
    if (userFound.rol === 'admin') {
      const allUsers = await User.find({}, { password: 0 }); // Obtener todos los usuarios sin contraseña
      dataToRender.users = allUsers; // Añadir la lista de usuarios al objeto de datos
    }

    // Renderizar la vista profile.ejs, pasando el objeto de datos
    res.render('profile', dataToRender);

  } catch (error) {
    console.error(error);
    // Considerar un manejo de error más amigable para el usuario
    res.status(500).send('Error interno del servidor al cargar el perfil.');
  }
};


export const changePassword = async (req, res) => {
  console.log("REQ.BODY:", req.body);  // <--- Registro para debug

  const userId = req.user.id; // obtenido del middleware `authenticate`
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // Validar que todos los campos estén presentes
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  // Validar que la nueva contraseña y la confirmación coincidan
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'Las nuevas contraseñas no coinciden.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    // Verificar que la contraseña actual sea correcta
    const passwordMatch = await comparePasswords(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
    }

    // Hashear y guardar la nueva contraseña
    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar la contraseña. Intenta más tarde.' });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie('token', { httpOnly: true, secure: false });
  if (req.accepts('html')) {
    res.redirect('/');
  } else {
    res.status(200).json({ message: 'Sesion cerrada correctamente.' });
  }
};

function handleResponse(req, res, statusCode, data, view) {
  if (req.accepts('html')) {
    return res.status(statusCode).render(view, data);
  } else {
    return res.status(statusCode).json(data);
  }
}

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

    return res.json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña: ', error);
    return res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
};
