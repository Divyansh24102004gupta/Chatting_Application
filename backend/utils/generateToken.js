import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, //prevent XSS attacks known as cross site scripting attack
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict", //csrf attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSetCookie;
