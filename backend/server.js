import express from "express";
const app = express();

//configuring env
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

//database file
import "./db.js";

//configuring cloudinary
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//configuring Stripe Payment Gateway
import Stripe from "stripe";
export const stripe = new Stripe(process.env.Secret_key);

//importing Middlewares
import cors from "cors";
import colors from "colors";
import morgan from "morgan";

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//using routes files

//using userRoutes files
import userRouter from "./Routes/UserRoutes.js";
app.use(userRouter);

//using Product Routes files
import productRouter from "./Routes/ProductRoutes.js";
app.use(productRouter);

//using category Routes file
import categoryRoutes from "./Routes/CategoryRoutes.js";
app.use(categoryRoutes);

//using Order Routes file
import orderRouter from "./Routes/OrderRoutes.js";
app.use(orderRouter);

//listening on the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgMagenta.white);
});
