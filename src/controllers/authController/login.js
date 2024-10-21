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
exports.default = Login;
const user_1 = require("../../model/user");
const bcrypt_1 = require("bcrypt");
const check_if_user_lock_1 = require("../../utils/check-if-user-lock");
const message_1 = __importDefault(require("../../utils/message"));
const gen_token_and_set_cookie_1 = require("../../utils/gen-token-and-set-cookie");
function Login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username_or_email, password } = req.body;
        // console.log(username_or_email, password);
        if (!username_or_email || !password) {
            return res
                .status(400)
                .json({ success: false, error: "Fill up all the fields" });
        }
        try {
            // Find the user by either email or username using $or
            const log_user = yield user_1.User.findOne({
                $or: [
                    { email: username_or_email }, // Check if email matches
                    { username: username_or_email }, // Check if username matches
                ],
            });
            if (!log_user) {
                return res
                    .status(400)
                    .json({ success: false, error: "User is not found" });
            }
            // Check if the user is locked
            if ((0, check_if_user_lock_1.checkLockStatus)(log_user)) {
                return res.status(403).json({
                    success: false,
                    error: "The account was locked for 30 minutes, because too many failed attempts",
                });
            }
            // Compare the password with the hashed password in the database
            const isPasswordValid = yield (0, bcrypt_1.compare)(password, log_user.password);
            if (!isPasswordValid) {
                let MAX_ATTEMPTS = 3;
                // Increment failedAttempts by 1 atomically in MongoDB
                yield user_1.User.updateOne({ _id: log_user._id }, {
                    $inc: { failedAttempts: 1 }, // Increment failedAttempts
                });
                // Re-fetch the user to get the updated failedAttempts value
                const updatedUser = yield user_1.User.findById(log_user._id);
                const remainingChances = MAX_ATTEMPTS - updatedUser.failedAttempts;
                // If failedAttempts reaches 3, lock the account
                if (updatedUser.failedAttempts >= 3) {
                    updatedUser.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
                    yield updatedUser.save(); // Save lockUntil field
                    return res.status(400).json({
                        success: false,
                        error: "Account was locked for too many failed attempts",
                    });
                }
                return res.status(400).json({
                    success: false,
                    error: `Invalid credentials. You only have remaining ${remainingChances} chances. Please try it again!`,
                });
            }
            // Check if the user is verified
            if (!log_user.isVerified) {
                return res
                    .status(400)
                    .json({ success: false, error: "User is not verified" });
            }
            // Reset failed attempts after successful login
            log_user.failedAttempts = 0;
            log_user.lockUntil = null;
            // Generate token and set cookie
            (0, gen_token_and_set_cookie_1.generateTokenAndSetCookie)(res, log_user._id);
            // Update last login time
            log_user.lastLogin = new Date();
            yield log_user.save(); // Save the reset state and last login time
            return (0, message_1.default)(res, "You logged in successfully", true, 200);
        }
        catch (error) {
            return res
                .status(500)
                .json({ error: "Internal server error", success: false });
        }
    });
}
