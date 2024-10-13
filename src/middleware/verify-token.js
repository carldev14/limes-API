"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("../config/dotenv"); // Import your secret
function verifyToken(req, res) {
    const { token } = req.body; // Access cookie from request
    try {
        const decoded = jsonwebtoken_1.default.verify(token, dotenv_1.JWT_SECRET);
        req.userId = decoded.userId;
        return res.status(200).json({ success: true, message: 'Success' });
    }
    catch (error) {
        console.error('Error in verifyToken ', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
;
