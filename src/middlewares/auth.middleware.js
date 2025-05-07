import { verifyToken } from '../services/jwt.service.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Puedes acceder a req.user.id, req.user.rol, etc.
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};


