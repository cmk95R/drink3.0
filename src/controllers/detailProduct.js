import productsData from '../db-json/productos.json' assert { type: 'json' };

const detailProduct = (req, res) => {
  // Convertir el ID a cadena de texto para asegurar coincidencia si los IDs en productos.json son strings
  const idParam = req.params.id; 

  try {
    // Buscar el producto en el array de productos por su id (asegurando que coincida el tipo)
    const prodFind = productsData.find(product => product.id.toString() === idParam);
    const user = req.session.user || null;
    console.log('Producto encontrado:', prodFind); // Esto muestra el producto en la consola del servidor

    if (prodFind) {
      const relatedProducts = productsData.filter(product => 
        product.categoria && 
        product.categoria === prodFind.categoria && 
        product.id !== prodFind.id
      ).slice(0, 3); // Limitar a 3 productos relacionados

      return res.render('productDetail', { 
        prodfind: prodFind, 
        relatedProducts: relatedProducts,
        user
      });
    } else {
      return res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error en el servidor: ', error);
    return res.status(500).send('Error en el servidor');
  }
};

export default detailProduct;