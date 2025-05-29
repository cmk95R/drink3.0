//Importaciones
import User from '../models/user.js';  
import { hashPassword,comparePasswords } from '../services/password.services.js';
import { createAccessToken } from '../services/jwt.service.js';

/*----------exporta la renderización del formulario register---------*/
export const showRegisterForm = (req, res) => {
    res.render('register', { formData: {}, errors: [] });
};

/*----------------- Funcion Register ----------------*/
export const register = async (req,res,next)=>{
     const { name, email, rol, password, edad } = req.body;
     const formData = { name, email, rol, edad };
     let errors = [];

     //verificar si falta algun campo
      if (!name || !email || !rol || !password || !edad) {
        errors.push({ msg: 'Todos los campos son obligatorios.' });
        return handleResponse(req, res, 400, { errors, formData }, 'register');
      }

    try{
      //si el mail que se introdujo ya existe, da error
        const existingUser = await User.findOne({email});
        if (existingUser) {
            errors.push({ msg: 'El correo ya está registrado.' });
            return handleResponse(req, res, 400, { errors, formData }, 'register');
          }

          //hashea la contraseña y crea un usuario dentro de la bdd con la contraseña hasheada
          const hashedPassword = await hashPassword(password);
          const newUser = new User({ name, email, rol, password: hashedPassword, edad });
          await newUser.save();

    //Da paso al siguiente middleware (mConfirmacion) para enviar la notificacion del mail
    next();
        
    //Error
    }catch(error){
        console.error(error);
        errors.push({ msg: 'Error en el registro. Inténtalo más tarde.' });
        return handleResponse(req, res, 500, { errors, formData }, 'register');

    }
};


/*----------exporta la renderización del formulario login---------*/
export const showLoginForm = (req, res) => {
    res.render('login', { error: null });
  };

/*----------------- Función Login -------------------*/
export const login = async (req, res) => {
    const { email, password } = req.body;

    //Si no coincide ninguno de los 2 campos, tirar error
    if (!email || !password) {
        return handleResponse(req, res, 400, { error: 'Email y contraseña son requeridos.' }, 'login');
    }


    try {
      //buscar usuario
        const user = await User.findOne({ email });
            //si no lo encuentra o las contraseñas son distintas a la bdd, tirar error
            if (!user || !(await comparePasswords(password, user.password))) {
              return handleResponse(req, res, 401, { error: 'Credenciales inválidas.' }, 'login');
            }

        // Otorga el token a los usuarios
        const token = createAccessToken({ id: user._id, rol: user.rol });

        // Guardar sesión y cookie solo si usás vistas
        req.session.user = {
            id: user._id,
            name: user.name,
            rol: user.rol,
            email: user.email
        };
        //guardar sesion en la cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 //equivale a 1 día
        });

        //medida de seguridad para excluir la contraseña del userData
        const { password: _, ...userData } = user.toObject();

        // Detectar si la petición espera JSON (API) o HTML (navegador)
        if (req.accepts('html')) {
          return res.redirect('/');
        } else {
          return res.status(200).json({ token, user: userData });
        }


    } catch (error) {
        console.error(error);
        return handleResponse(req, res, 500, { error: 'Error interno del servidor.' }, 'login');
    }
};


/*---------------- Función profile (renderizar) -----------*/
export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.redirect('/auth/login');
    res.render('profile', { user: userFound });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};

/*-------------- Funcion cambiar contraseña -------------------------*/
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



/*-------------- Cerrar Sesión -----------------*/

export const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie('token', { httpOnly: true, secure: false });
  if (req.accepts('html')) {
    res.redirect('/');
  } else {
    res.status(200).json({ message: 'Sesion cerrada correctamente.' });
  }
};


/*---------------Alerts-------------*/

function handleResponse(req, res, statusCode, data, view) {
  if (req.accepts('html')) {
    return res.status(statusCode).render(view, data);
  } else {
    return res.status(statusCode).json(data);
  }
}

/*----------Función resetear contraseña-------------*/
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
