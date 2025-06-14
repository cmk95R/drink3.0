import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';  // Importar express-session
import indexRouter from './routes/index.routes.js';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";//va o no va.
import hireModulesRoutes from "./routes/hireModules.routes.js";
import orderRoutes from "./routes/order.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import productRoutes from "./routes/product.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import horarioRoutes from "./routes/horario.routes.js";
import methodOverride from 'method-override';
// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancia de la aplicación Express
const app = express();

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'src', 'pages'));

// Configurar las rutas estáticas
app.use('/resources/js', express.static(path.join(__dirname, 'resources/js')));
app.use('/resources/css', express.static(path.join(__dirname, 'resources/css')));
app.use('/resources/imagenes', express.static(path.join(__dirname, 'resources/imagenes')));
app.use(express.static(path.join(__dirname, 'src/pages')));



// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de express-session para gestionar sesiones de usuario
app.use(session({
  secret: 'mi_secreto',  // Cambia esto a algo más seguro
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Asegúrate de cambiar a 'true' si usas HTTPS
}));

app.use((req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;  // Pasamos el usuario a las vistas
    }
    next();
});
// Posible auth

app.use(methodOverride('_method'));

app.use('/auth',authRoutes);

app.use("/users",userRoutes);//consultar- va o no va
app.use('/hire-modules', hireModulesRoutes);
app.use("/horario",horarioRoutes);
app.use("/orders",orderRoutes);
app.use("/products",productRoutes);
app.use("/stock", stockRoutes);
app.use('/dashboard', dashboardRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));




app.use('/', indexRouter);


export default app;
