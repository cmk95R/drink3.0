import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /.+@.+\..+/,
    unique: true
  },
  rol: {
    type: String,
    required: true,
    enum: ['admin', 'cliente']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  edad: {
    type: Number,
    required: true
  },

  // Este campo solo aplica a usuarios con rol "cliente"
  pro: {
    type: Boolean,
    default: false
  },

  ftpUserId: {
    type: String,
    unique: true,
    default: uuidv4
  }

}, { timestamps: true });


 //Middleware para asegurar que solo los "clientes" tengan el campo "pro"
userSchema.pre('save', function (next) {
  if (this.rol !== 'cliente') {
    this.pro = undefined; // elimina el campo si no es cliente
  }
  next();
});

export default mongoose.model('User', userSchema);