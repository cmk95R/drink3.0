import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/drinkdb";
    await mongoose.connect(mongoUri);
    console.log("🟢 MongoDB conectado con éxito");
  } catch (error) {
    console.error("🔴 Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};