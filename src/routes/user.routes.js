import { Router } from "express";
import mongoose from "mongoose";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { authenticate } from "../middlewares/auth.middleware.js";
import User from '../models/user.js';

const router = Router();

// Mostrar formulario de edición de usuario
router.get('/:id/edit', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID inválido');
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.render('editUser', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

// Crear nuevo usuario
router.post('/', authenticate, createUser);

// Obtener todos los usuarios
router.get('/', authenticate, getAllUsers);

// Obtener un usuario por ID (formato JSON)
router.get('/:id', authenticate, getUserById);

// Actualizar usuario
router.put('/:id', authenticate, updateUser);

// Eliminar usuario
router.delete('/:id', authenticate, deleteUser);

export default router;
