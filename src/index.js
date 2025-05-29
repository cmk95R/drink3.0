import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("MONGO_URI:", process.env.MONGO_URI);

import app from "./app.js";
import { connectDB } from "./db.js";

const port = process.env.PORT || 3000;

connectDB();
app.listen(port);

console.log("Server Funcionando en puerto " + port + " http://localhost:" + port);
