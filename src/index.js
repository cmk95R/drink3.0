
import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import { connectDB } from "./db.js";

const port = process.env.PORT || 3000;

connectDB()
app.listen(port);

console.log("Server Funcionando en puerto " + port + " http://localhost:" + port);