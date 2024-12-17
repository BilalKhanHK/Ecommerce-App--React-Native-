import express from "express";
import {
  adminAccessController,
  getAllAdminsController,
  getAllUsersController,
  getUserProfileController,
  registerController,
  updatePasswordController,
  updateProfilePicController,
  updateUserProfileController,
  userLoginController,
} from "../Controllers/UserController.js";
const userRouter = express.Router();
import { body, validationResult } from "express-validator";
import auth from "./../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { isAdmin } from "../middlewares/isAdmin.js";

//User Register route
userRouter.post(
  "/register",
  singleUpload,
  [
    body("name", "Name must be between 3 and 20 characters long").isLength({
      min: 3,
      max: 20,
    }),
    body("email", "Please enter a valid email address").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("country").notEmpty().withMessage("country is required"),
    body("phone").notEmpty().withMessage("phone is required"),
  ],
  registerController
);

//User login route
userRouter.post(
  "/login",
  [
    body("email", "Please enter a valid email address").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  userLoginController
);

//user Profile route
userRouter.get("/profile", auth, getUserProfileController);

//update Profile route
userRouter.put("/UpdateProfile", auth, updateUserProfileController);

//give admin access
userRouter.put("/adminAccess", auth, isAdmin, adminAccessController);

//update password route
userRouter.put("/UpdatePassword", auth, updatePasswordController);

//update Profile pic
userRouter.put(
  "/UpdateProfilePic",
  auth,
  singleUpload,
  updateProfilePicController
);

//gettign All users
userRouter.get("/getAllUsers", auth, isAdmin, getAllUsersController);

//gettign All admin
userRouter.get("/getAllAdmins", auth, isAdmin, getAllAdminsController);

export default userRouter;
