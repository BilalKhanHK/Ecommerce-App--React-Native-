import User from "../Models/UserModel.js";
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only Admin have access to this resource." });
    }
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error in isAdmin middleware", error });
  }
};
