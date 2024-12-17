import express from "express";
const orderRouter = express.Router();
import { body, validationResult } from "express-validator";
import auth from "../middlewares/auth.js";
import { isAdmin } from "./../middlewares/isAdmin.js";
import {
  createOrderController,
  getAllOrdersController,
  getOrderController,
  getSingleOrderController,
  paymentController,
  updateOrderStatusController,
} from "../Controllers/OrderController.js";

//creating order route
orderRouter.post("/createOrder", auth, createOrderController);

//gettingOrders
orderRouter.get("/getOrders", auth, getOrderController);

//get Single Order
orderRouter.get("/getSingleOrder/:id", auth, getSingleOrderController);

//accept payment route
orderRouter.post("/payment", auth, paymentController);

//get all orders
orderRouter.get("/AllOrders", auth, isAdmin, getAllOrdersController);

//update order Status
orderRouter.put("/OrderStatus/:id", auth, isAdmin, updateOrderStatusController);

export default orderRouter;
