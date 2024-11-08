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
exports.default = default_1;
const user_1 = require("../../model/user");
const gen_verification_token_1 = require("../../utils/gen-verification-token");
const message_1 = __importDefault(require("../../utils/message"));
const send_1 = require("../../nodemailer/send");
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isResend } = req.body;
        try {
            if (isResend) {
                if (!req.userId) {
                    return res.status(400).json({ error: "User ID is missing", success: false });
                }
                const user = yield user_1.User.findOne({ _id: req.userId });
                if (!user) {
                    return res.status(404).json({ error: "User not found", success: false });
                }
                // if user are already verified, don't allow any request for resending verify email
                if (user.isVerified) {
                    return res.status(401).json({
                        success: false,
                        error: "You are already verified",
                    });
                }
                // Set a default expiration date if verificationTokenExpiresAt is undefined
                if (!user.verificationTokenExpiresAt) {
                    user.verificationTokenExpiresAt = new Date(0); // Set to past date
                }
                if (user.verificationTokenExpiresAt.getTime() > Date.now()) {
                    return res.status(401).json({
                        success: false,
                        error: "Your OTP has not expired yet. Please wait for about 5 minutes.",
                    });
                }
                // Generate a new verification token and update expiration
                const newToken = (0, gen_verification_token_1.generateVerificationToken)();
                user.verificationToken = newToken;
                user.verificationTokenExpiresAt = new Date(Date.now() + 300000);
                yield user.save(); // Save updated user
                (0, send_1.sendVerificationEmail)(user.email, newToken, user.name);
                return (0, message_1.default)(res, "Sent new OTP to your email. Kindly check and enter it here", true, 200);
            }
            else {
                return res.status(400).json({
                    success: false,
                    error: "An unexpected error occurred. If this issue persists, please contact support or your developer for assistance."
                });
            }
        }
        catch (error) {
            console.error("Error in resend verification:", error); // Log error
            return res.status(500).json({
                error: "Internal server error. Please try again later.",
            });
        }
    });
}
