import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    // try to find the user's token
    const token = req.cookies.token; // grab it from the cookie (this calls for cookie-parser)
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    // if token is found, decode it to make sure its valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // if all checkpoints are passed successfully, find the user to which this token belongs
    // send back user's info, besides the password
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // starting from here, insert a user field in each request - to be used in following functions
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
