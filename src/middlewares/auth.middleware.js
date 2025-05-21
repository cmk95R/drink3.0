import { verifyToken } from '../services/jwt.service.js';

export const authenticate = (req, res, next) => {
  // 1. Buscar el token en el header Authorization
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Si no está en el header, buscarlo en la cookie
  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }

  // 3. Si no hay token, rechazar
  if (!token) {
    //return res.status(401).json({ message: 'Token no proporcionado' });
    return res.redirect('/auth/login');
  }

  // 4. Verificar el token
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};



