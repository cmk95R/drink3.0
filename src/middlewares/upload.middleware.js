import multer from 'multer';
import path from 'path';
import fs from 'fs';

const dir = './uploads'; // Carpeta donde se guardan los archivos

// Crear la carpeta si no existe
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para validar tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedCSVTypes = /csv/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isImage = allowedImageTypes.test(ext) && allowedImageTypes.test(mimetype);
  const isCSV = allowedCSVTypes.test(ext) && (mimetype === 'text/csv' || mimetype === 'application/vnd.ms-excel');

  if (isImage || isCSV) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo imágenes (.jpg, .png, .gif) o archivos .csv'), false);
  }
};

// Exportar el middleware
const upload = multer({ storage, fileFilter });

export default upload;