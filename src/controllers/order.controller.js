//Importaciones
import mongoose from 'mongoose';
import Order from '../models/order.js';

const validateObjectIdOrd = (id) => mongoose.Types.ObjectId.isValid(id);

//Exportar función "crear Orden"
export const createOrder = async (req, res) => {
  try {
    //Para crear la orden se necesita el estado de la orden, el id del producto y los productos dentro del pedido
    const { estado, clienteId, products } = req.body;
    if (!estado || !clienteId || !products || products.length === 0) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    //Crea la orden con los datos previamente consultados
    const newOrder = new Order({ estado, clienteId, products });
    await newOrder.save();
    res.status(200).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Hubo un error, prueba más tarde' });
  }
};

//Exporta la función "obtener ordenes por id" de usuario
export const getOrdersById = async (req, res) => {
  try {
    //obtiene los productos por id y luego verifica si son válidos
    const { id } = req.params;
    if (!validateObjectIdOrd(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    //sirve para relacionar las bdd, aparentemente útil para relacionar ordenes con usuarios
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

//Funcion para obtener todas las ordenes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('clienteId')
      .populate('products.productId');
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
  }
};

//Funcion para actualizar ordenes
export const updateOrder = async (req, res) => {
  
  //Valida los productos por id
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
