import { body, validationResult } from "express-validator";
import OrderModel from "../Models/OrderModel.js";
import ProductModel from "../Models/ProductsModel.js";
import { stripe } from "../server.js";
import User from "../Models/UserModel.js";

//creating order
export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    //create order
    let CreatedOrder = await OrderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      tax,
      shippingCharges,
      totalAmount,
    });

    //notify user
    const notifiedUser = await User.findById(req.user._id);
    if (!notifiedUser) {
      return res.status(403).json({
        message: "User Not Found.",
        success: false,
      });
    }
    notifiedUser.notifications.push({
      message: `You Created a new order.New Order #${CreatedOrder._id} is placed`,
    });
    if (CreatedOrder.paymentMethod === "ONLINE") {
      notifiedUser.notifications.push({
        message: `Your Online Payment Successfull.You Paid #${CreatedOrder.totalAmount}$. And your Order Id is #${CreatedOrder._id}`,
      });
    }
    await notifiedUser.save();

    //updating Stock
    // console.log(CreatedOrder.orderItems);
    for (let i = 0; i < CreatedOrder.orderItems.length; i++) {
      const product = await ProductModel.findById(
        CreatedOrder.orderItems[i].product
      );
      product.stock -= CreatedOrder.orderItems[i].quantity;
      await product.save();
    }
    res.json({
      message: "Order Created Successfully",
      success: true,
      user: notifiedUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error in creating Order Api.", success: false });
  }
};

//getting user all orders
export const getOrderController = async (req, res) => {
  try {
    const orders = await OrderModel.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    if (orders.length < 1) {
      return res
        .status(404)
        .json({ message: "No Orders Found", success: false });
    }
    res.json({
      success: true,
      message: "All orders are Fetched Successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error in Getting User Orders Api.", success: false });
  }
};

//getting user single order
export const getSingleOrderController = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "No Order Found", success: false });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You do not have to access to get this order",
        success: false,
      });
    }
    res.json({ success: true, message: "Order Found", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error in Getting User Order Api.", success: false });
  }
};

//payment controller
export const paymentController = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount) {
      return res
        .status(400)
        .json({ message: "Total amount is required", success: false });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount) * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ success: true, message: "Payment Successful", client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in Payment Api.", success: false });
  }
};

//get All orders
export const getAllOrdersController = async (req, res) => {
  try {
    const allOrders = await OrderModel.find({}).populate("user").sort({
      createdAt: -1,
    });
    if (allOrders.length < 1) {
      return res
        .status(404)
        .json({ message: "No Orders Found", success: false });
    }
    res.json({
      success: true,
      message: "All orders are Fetched Successfully",
      totalOrders: allOrders.length,
      orders: allOrders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error in Getting All orders  Api.", success: false });
  }
};

//update order Status
export const updateOrderStatusController = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    const { id } = req.body;
    if (!order) {
      return res
        .status(404)
        .json({ message: "No Order Found", success: false });
    }

    //notify user
    const notifiedUser = await User.findById(req.user._id);
    if (!notifiedUser) {
      return res.status(403).json({
        message: "User Not Found.",
        success: false,
      });
    }

    if (order.orderStatus === "processing") {
      order.orderStatus = "shipped";
      notifiedUser.notifications.push({
        message: `Your Order #${order._id} is Shipped.`,
      });
      await notifiedUser.save();
    } else if (order.orderStatus === "shipped") {
      order.orderStatus = "delivered";
      order.deliveredAt = new Date();
      notifiedUser.notifications.push({
        message: `Your Order #${order._id} is Delivered.`,
      });
      await notifiedUser.save();
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Order already delivered" });
    }

    //saving order Status
    await order.save();
    //sending Response
    res.json({
      success: true,
      message: "Order Status Updated",
      order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error in Updating Order Status Api.", success: false });
  }
};
