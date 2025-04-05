import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    const cookieOptions = serialize("jwt", token, {
        maxAge: 15 * 24 * 60 * 60, 
        httpOnly: true, 
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    res.setHeader("Set-Cookie", cookieOptions);
    return token;
};