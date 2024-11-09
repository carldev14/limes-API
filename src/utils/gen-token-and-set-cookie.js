"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndSetCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("../config/dotenv");
const generateTokenAndSetCookie = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, dotenv_1.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Change to true if using HTTPS
        sameSite: "none", // Ensure secure is true if using sameSite: 'none'
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain: "https://limes-apis.onrender.com", // Correct domain format
    });
    return token;
};
exports.generateTokenAndSetCookie = generateTokenAndSetCookie;
