import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const portectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "user does not authorized, invalid token!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "user does not authorized, invalid token!",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log(error);
      return res.status(404).json({
        success: false,
        message: "internal server error!",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export default portectRoute;
