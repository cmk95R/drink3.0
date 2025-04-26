import { body } from "express-validator";
import User from "../models/user.model.js";

export const validacionesRegister = [
  // Validación del nombre de usuario
  body("username")
    .notEmpty()
    .withMessage("El campo nombre de usuario no debe estar vacío")
    .isLength({ min: 3 })
    .withMessage("El nombre de usuario debe tener al menos 3 caracteres"),

  // Validación del email
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Formato de email inválido")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("El email ya se encuentra registrado");
      }
      return true;
    }),

  // Validación de la contraseña
  body("password")
    .notEmpty()
    .withMessage("El campo contraseña no debe estar vacío")
    .isLength({ min: 6 })
    .withMessage("Tu contraseña debe tener al menos 6 caracteres"),

  // Validación del teléfono
  body("phoneNumber")
    .notEmpty()
    .withMessage("El número de teléfono es obligatorio")
    .isNumeric()
    .withMessage("El número de teléfono debe contener solo números")
    .isLength({ min: 10, max: 15 })
    .withMessage("El número de teléfono debe tener entre 10 y 15 caracteres")
    .custom(async (value) => {
      const existingUser = await User.findOne({ phoneNumber: value });
      if (existingUser) {
        throw new Error("El número de teléfono ya se encuentra registrado");
      }
      return true;
    }),

  // Validación de la dirección (calle, ciudad, provincia y código postal)
  body("address.street")
    .notEmpty()
    .withMessage("La calle es obligatoria"),
  body("address.city")
    .notEmpty()
    .withMessage("La ciudad es obligatoria"),
  body("address.province")
    .notEmpty()
    .withMessage("La provincia es obligatoria"),
  body("address.postalCode")
    .notEmpty()
    .withMessage("El código postal es obligatorio")
    .isNumeric()
    .withMessage("El código postal debe contener solo números")
    .isLength({ min: 4, max: 8 })
    .withMessage("El código postal debe tener entre 4 y 8 caracteres"),
];
