import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import User from "../Models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

//user Register controller
export const registerController = async (req, res) => {
  try {
    let success;
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }

    //check wether the user with the same email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      success = 1;
      return res.status(400).json({ success, message: "User already exists" });
    }
    if (!req.file) {
      success = 2;
      return res
        .status(400)
        .json({ success, message: "Please upload a profile picture" });
    } else {
      //hash the password
      let secPass = await bcrypt.hash(req.body.password, 10);
      let secQuestion = await bcrypt.hash(req.body.securityQuestion, 10);

      const file = getDataUri(req.file);
      const cdb = await cloudinary.v2.uploader.upload(file.content);
      const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      };

      //creating user and saving it it database
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        address: req.body.address,
        city: req.body.city,
        phone: req.body.phone,
        country: req.body.country,
        securityQuestion: secQuestion,
        isAdmin: req.body.isAdmin,
        profilePic: image,
      });
      await user.save();
      success = 3;
      // generate JWT token for the user
      const token = jwt.sign({ id: user.id }, process.env.key, {
        expiresIn: "24h",
      });

      res.json({
        success,
        message: "User registered successfully",
        token,
        user,
      });
    }
  } catch (error) {
    res.status(500).json({ error, message: "Error in User Register Api." });
    console.error(error);
  }
};

// user login controller
export const userLoginController = async (req, res) => {
  try {
    let success;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    //check wether the user with the given email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: 1, message: "User not found" });
    } else if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res
        .status(400)
        .json({ success: 1, message: "Incorrect password" });
    } else {
      // generate JWT token for the user
      const token = jwt.sign({ id: user.id }, process.env.key, {
        expiresIn: "24h",
      });
      res.json({
        success: 2,
        message: "User logged in successfully",
        token,
        user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Error in User Login Api.", success: false });
    console.error(error);
  }
};

//get user profile
export const getUserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.password = undefined;
    user.securityQuestion = undefined;
    res.json({ success: true, user, message: "User found Successfully" });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in getting User Profile Api.",
      success: false,
    });
    console.error(error);
  }
};

//update user profile
export const updateUserProfileController = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in updating User Profile Api.",
      success: false,
    });
    console.error(error);
  }
};

//update user profile
export const adminAccessController = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.isAdmin = true;
    await user.save();
    res.json({ success: true, user, message: "Admin Access Successfull" });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in Give admin Access to User Api.",
      success: false,
    });
    console.error(error);
  }
};

//update user password
export const updatePasswordController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let { securityQuestion, newPassword } = req.body;
    if (!securityQuestion || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Security Question and New Password are required",
      });
    }
    const isMatch = await bcrypt.compare(
      securityQuestion,
      user.securityQuestion
    );

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Security Question" });
    }

    let secPass = await bcrypt.hash(newPassword, 10);
    user.password = secPass;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in updating Password Api.",
      success: false,
    });
    console.error(error);
  }
};

//update user profile pic
export const updateProfilePicController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    //file get from client photo
    const file = getDataUri(req.file);

    //destroy previous image
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

    //update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    await user.save();
    res.json({
      success: true,
      message: "Profile Pic updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in updating Profile Pic Api.",
      success: false,
    });
    console.error(error);
  }
};

//getting All users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    if (users.length < 1) {
      return res.status(404).json({ success: false, message: "No User found" });
    }
    res.json({
      success: true,
      message: "Users fetched successfully",
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in fetching Users Api.",
      success: false,
    });
    console.error(error);
  }
};

//getting All Admins
export const getAllAdminsController = async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true });
    if (admins.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "No Admin found" });
    }
    res.json({
      success: true,
      message: "Admins fetched successfully",
      totalUsers: admins.length,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in fetching Admins Api.",
      success: false,
    });
    console.error(error);
  }
};
