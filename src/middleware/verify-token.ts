import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/dotenv"; // Import your secret

// ... (Rest of your Express setup)
interface CustomJwtPayload extends JwtPayload {
  userId: string; // Define userId as a string
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token; // get the token from the browser or frontend

  if (!token) {
    return res
      .status(400)
      .json({ error: "User not authenticated", success: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Error in verifyToken ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
