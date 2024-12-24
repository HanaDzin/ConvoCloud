import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // each user will be assigned a unique token based on their userId
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // this token will be set in the cookies
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // secure if we are in production
  });

  return token;
};
