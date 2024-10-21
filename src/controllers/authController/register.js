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
exports.default = Register;
const user_1 = require("../../model/user"); // Ensure the path is correct
const bcrypt_1 = require("bcrypt");
const gen_verification_token_1 = require("../../utils/gen-verification-token"); // Ensure this path is correct
const send_1 = require("../../nodemailer/send");
const message_1 = __importDefault(require("../../utils/message"));
function Register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Directly access req.body for the data
        const { email, password, username } = req.body;
        console.log(email, password, username);
        if (!email || !password || !username) {
            return res
                .status(400)
                .json({ success: false, error: "Fill up all the fields" });
        }
        try {
            req.headers["x-forwarded-for"];
            const clientIp = req.socket.remoteAddress;
            const checkEmail = yield user_1.User.findOne({ email });
            const checkUsername = yield user_1.User.findOne({ username });
            if (checkEmail) {
                console.log(clientIp);
                return res
                    .status(400)
                    .json({ success: false, error: "Email is already in use" });
            }
            if (checkUsername) {
                return res
                    .status(400)
                    .json({ success: false, error: "Username is already in use" });
            }
            const saltPassword = yield (0, bcrypt_1.hash)(password, 10); // Hash the password
            const verificationToken = (0, gen_verification_token_1.generateVerificationToken)(); // Generate a verification token
            const reg_user = new user_1.User({
                ip_a: clientIp,
                email,
                password: saltPassword,
                username,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
            });
            yield reg_user.save();
            (0, send_1.sendVerificationEmail)(reg_user.email, verificationToken, reg_user.name);
            return (0, message_1.default)(res, "User created successfully", true, 201);
        }
        catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ message: "Internal server error ", success: false });
        }
    });
}
