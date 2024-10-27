"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyEmail;
const user_1 = require("../../model/user");
const message_1 = __importDefault(require("../../utils/message"));
function VerifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code } = req.body;
        console.log(code, req.userId);
        try {
            const user = yield user_1.User.findOne({
                verificationToken: code,
                _id: req.userId
            });
            // Check if the user exists
            if (!user) {
                return res.status(400).json({ error: "User not found or invalid OTP provided", success: false });
            }
            // Check if the verification token is present
            if (!user.verificationToken) {
                return res.status(400).json({ error: "Invalid OTP provided", success: false });
            }
            // Check if the OTP has expired
            if (user.verificationTokenExpiresAt.getTime() < Date.now()) {
                return (0, message_1.default)(res, "OTP has expired", false, 400);
            }
            // Update user verification status
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiresAt = undefined;
            yield user.save(); // Save the updated user
            return (0, message_1.default)(res, "Your email is now verified", true, 200);
        }
        catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Internal server error", success: false });
        }
    });
}
