import User from '../models/user.js';  

// Renderiza la vista con el botón, pasando si el usuario es Pro
export const renderHireModulesPage = (req, res) => {
  res.render('hireModules', { user: req.session.user });
};

export const buyProModules = async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    const sessionUser = req.session.user;
    if (!sessionUser || !sessionUser.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    // Buscar al usuario en la base de datos
    const user = await User.findById(sessionUser.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar el campo 'pro' del usuario
    user.pro = true;
    await user.save();

    // (opcional) actualizar sesión en vivo
    req.session.user.pro = true;

    return res.redirect('/dashboard');
  } catch (error) {
    console.error("❌ Error al activar el plan Pro:", error);
    return res.status(500).json({ message: 'Error al activar el plan Pro.' });
  }
};

export const cancelProModules = async (req, res) =>{
    
  try {
    // Verificar si el usuario está autenticado
    const sessionUser = req.session.user;
    if (!sessionUser || !sessionUser.id) {
      return res.status(403).json({ message: 'No autorizado.' });
    }

    // Buscar al usuario en la base de datos
    const user = await User.findById(sessionUser.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar el campo 'pro' del usuario
    user.pro = false;
    await user.save();

    // (opcional) actualizar sesión en vivo
    req.session.user.pro = false;

    return res.redirect('/dashboard');
  } catch (error) {
    console.error("❌ Error al desactivar el plan Pro:", error);
    return res.status(500).json({ message: 'Error al desactivar el plan Pro.' });
  }
}