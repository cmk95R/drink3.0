import Product from '../models/product.js';

export const detailProduct = async (req, res) => {
  try {
    const idParam = req.params.id;

    // Validar que el ID sea válido para evitar errores en la consulta
    if (!idParam || !idParam.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send('ID inválido');
    }
    // Buscar el producto por ID
    const prodFind = await Product.findById(idParam).lean(); // lean para obtener objeto plano
    if (!prodFind) {
      return res.status(404).send('Producto no encontrado');
    }
    // Buscar productos relacionados (misma categoría, distinto ID)
    const relatedProducts = await Product.find({
      category: prodFind.category,
      _id: { $ne: prodFind._id }
    })
      .limit(3)
      .lean();

    // Obtener usuario de sesión si existe
    const user = req.session.user || null;

    // Renderizar la vista y pasar datos
    return res.render('productDetail', {
      prodfind: prodFind,
      relatedProducts,
      user
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).send('Error en el servidor');
  }
};
export default detailProduct;