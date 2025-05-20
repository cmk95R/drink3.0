import { verifyToken } from '../services/jwt.service.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromCookie = req.cookies.token;
  let token = null;

  // Primero busca el token en el header, si no está, en la cookie
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (tokenFromCookie) {
    token = tokenFromCookie;
  }

  if (!token) {
    return res.redirect('/auth/login'); // Redirige al login si no hay token
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Decodificado disponible para rutas siguientes
    next();
  } catch (error) {
    return res.redirect('/auth/login'); // Redirige si el token es inválido
  }
};


