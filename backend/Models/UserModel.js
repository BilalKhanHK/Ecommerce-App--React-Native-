import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    securityQuestion: {
      type: String,
      required: true,
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    notifications: [
      {
        message: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);

export default User;
