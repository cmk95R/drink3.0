import multer from 'multer';
import path from 'path';
import fs from 'fs';

const dir = './uploads'; // carpeta en raíz del proyecto
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const mimeOK = allowed.test(file.mimetype);
  const extOK = allowed.test(path.extname(file.originalname).toLowerCase());
  cb(null, mimeOK && extOK);
};

const upload = multer({ storage, fileFilter });

export default upload;
