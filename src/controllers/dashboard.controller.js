import Product from '../models/product.js';
import Order from '../models/order.js';

export const getDashboard = async (req, res) => {
  try {
    // Validar autenticación (si tienes req.user)
    if (!req.user) {
      return res.status(401).render('error', { message: 'No autorizado' });
    }

    // Obtener todos los productos
    const productos = await Product.find().lean(); // lean() para simplificar los objetos

    // Obtener todas las órdenes
    const ordenes = await Order.find()
      .sort({ fecha: -1 })
      .populate('clienteId', 'name email')
      .populate('products.productId', 'name price')
      .lean();

    // Renderizar vista dashboard.ejs con los datos
    return res.render('dashboard', {
      user: req.user,       // Información del usuario logueado
      productos,            // Lista de productos
      ordenes,              // Lista de órdenes
    });

  } catch (error) {
    console.error("Error en dashboard:", error);
    return res.status(500).render('error', { message: 'Error interno del servidor' });
  }
};


