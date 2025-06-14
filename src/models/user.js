import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // ⚠️ Asegúrate de instalar uuid con: npm install uuid

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
  edad: { type: Number, required: true },

  // ✅ Nuevo campo para uso con servidor FTP
  ftpUserId: {
    type: String,
    unique: true,
    default: uuidv4 // Se genera automáticamente al crear el usuario
  }

}, { timestamps: true });

export default mongoose.model('User', userSchema);



//Genere, la creacion de la cuenta, que nos genere el usurio del server ftp
//Usuario y nombre, el user=nombre y apalledi, una funcion de los dos
//Que cree<usuario>:<contraseña y un usuarioftp. validacion.
//El usuario ftp se companga del usuarip
//user add usuario ftp id, tru o false para que lo deje passa o no.
//?¿ Generar el id en el back,
