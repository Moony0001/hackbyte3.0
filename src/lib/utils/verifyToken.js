import jwt from "jsonwebtoken";

export function verifyToken(token) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (err) {
        console.error("Invalid token:", err.message);
        return null;
    }
}
