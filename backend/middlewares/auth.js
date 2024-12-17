import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers["auth-token"];
    const verifyUser = jwt.verify(token, process.env.key);
    if (!verifyUser) {
      return res
        .status(401)
        .json({ message: "User Not Found", success: false });
    }
    const user = await User.findOne({ _id: verifyUser.id });
    req.user = user;
    // console.log(user);
    req.token = token;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Error in auth middleware", error });
  }
};
export default auth;
