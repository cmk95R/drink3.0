import mongoose from 'mongoose';
import User from '../models/user.js';
import Order from '../models/order.js';
import Product from '../models/product.js';

const validateObjectIdOrd = (id) => mongoose.Types.ObjectId.isValid(id);

export const createOrder = async (req, res) => {
  try {
    console.log("📦 Datos recibidos en el backend:", req.body);
    const { estado, clienteId, products } = req.body;

    if (!estado) return res.status(400).json({ message: 'Estado es requerido' });
    if (!clienteId) return res.status(400).json({ message: 'Cliente es requerido' });
    if (!products || !Array.isArray(products) || products.length === 0)
      return res.status(400).json({ message: 'Debe haber al menos un producto' });

    // Validar y actualizar stock de productos
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `No hay suficiente stock de ${product.nombre}` });
      }

      // Descontar stock
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({ estado, clienteId, products });
    await newOrder.save();

    res.status(200).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Hubo un error, prueba más tarde' });
  }
};

export const getOrdersById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectIdOrd(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const order = await Order.findById(id)
      .populate('clienteId')
      .populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
  }
};


export const updateOrder = async (req, res) => {
  
  
  try {
    const { id } = req.params;
    if (!validateObjectIdOrd(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const { estado, clienteId, products } = req.body;
    const updated = await Order.findByIdAndUpdate(
      id,
      { estado, clienteId, products },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Hubo un error, pruebe más tarde.' });
  }
};

export const cancelOrder = async (req, res) => {
  
  try {
    const { id } = req.params;
    if (!validateObjectIdOrd(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const canceled = await Order.findByIdAndUpdate(
      id,
      { estado: 'cancelado' },
      { new: true }
    );
    if (!canceled) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.status(200).json({ message: `La orden con ID ${id} fue cancelada correctamente.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Hubo un error, prueba más tarde.' });
  }
};
