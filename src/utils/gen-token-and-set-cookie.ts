import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/dotenv";
import { Response } from "express";


export const generateTokenAndSetCookie = (res: Response, userId: string) => {
	const token = jwt.sign({ userId }, JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
		domain: 'https://limes-apis.onrender.com'
	});

	return token;

};