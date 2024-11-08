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
        secure: dotenv_1.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: 'https://limes-express-backend.onrender.com'
    });
    return token;
};
exports.generateTokenAndSetCookie = generateTokenAndSetCookie;
