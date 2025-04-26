import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    console.log(token);
    
    if (!token) {
        return res.redirect("/api/login"); // Si no hay token, redirige a login
    }

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Token inválido o expirado."); // Si el token es inválido o ha expirado
        }

        req.user = user; // Decodifica los datos del usuario y los asigna a `req.user`
        next(); // Continúa con el siguiente middleware
    });
};

