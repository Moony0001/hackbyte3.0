import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export const generateTokenAndSetCookie = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return serialize("jwt", token, {
    maxAge: 15 * 24 * 60 * 60, // 15 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};
