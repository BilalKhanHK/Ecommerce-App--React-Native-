import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let connectMongo = async () => {
  try {
    await mongoose.connect(process.env.Connection_String);
    console.log("Connected to MongoDB".bgYellow.white);
  } catch (error) {
    console.log("Connection Failed: ".bgRed, error);
  }
};

connectMongo();
