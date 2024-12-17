import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Shipping address is required"],
      },
      city: {
        type: String,
        required: [true, "Shipping city is required"],
      },
      country: {
        type: String,
        required: [true, "Shipping Country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
        },
        image: {
          type: String,
          required: [true, "Product image is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductModel",
          required: [true, "Product id is required"],
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paidAt: {
      type: Date,
    },
    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
    },
    tax: {
      type: Number,
      required: [true, "Item Tax is required"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "Item Shipping Charges is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total Amount is required"],
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const OrderModel = new mongoose.model("OrderModel", OrderSchema);
export default OrderModel;
