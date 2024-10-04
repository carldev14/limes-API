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
exports.sendVerificationEmail = sendVerificationEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const templates_1 = require("./templates");
const dotenv_1 = require("../config/dotenv");
// Create a Nodemailer transporter using SMTP transport
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: dotenv_1.EMAIL,
        pass: dotenv_1.PASSWORD
    }
});
function sendVerificationEmail(email, verificationToken, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mailOptions = {
                from: dotenv_1.EMAIL,
                to: email,
                subject: 'Please verify your email',
                html: templates_1.VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken)
            };
            yield transporter.sendMail(mailOptions);
            return {
                success: true,
                message: 'Verification email sent successfully',
            };
        }
        catch (error) {
            console.error('Error sending email:', error);
            return {
                success: false,
                message: 'Failed to send verification email',
            };
        }
    });
}
