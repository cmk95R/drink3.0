import { body } from "express-validator";
import User from "../models/user.model.js";

export const validacionesLogin = [
  // Validación del email
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Formato de email inválido")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (!existingUser) {
        throw new Error("El email no está registrado");
      }
      return true;
    }),

  // Validación de la contraseña
  body("password")
    .notEmpty()
    .withMessage("El campo contraseña no debe estar vacío")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];
