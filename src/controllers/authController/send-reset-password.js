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
exports.default = SendResetPassword;
const user_1 = require("../../model/user");
const message_1 = __importDefault(require("../../utils/message"));
const gen_verification_token_1 = require("../../utils/gen-verification-token");
const send_1 = require("../../nodemailer/send");
function SendResetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        try {
            const reset_user_pass = yield user_1.User.findOne({
                email,
            });
            if (!reset_user_pass) {
                return (0, message_1.default)(res, "Coundn't find your account", false, 400);
            }
            const verificationToken = (0, gen_verification_token_1.generateVerificationToken)(); // Generate a verification token
            reset_user_pass.resetPasswordToken = verificationToken;
            reset_user_pass.resetPasswordExpiresAt = Date.now() + 3600000;
            reset_user_pass.save();
            (0, send_1.sendVerificationEmail)(email, verificationToken, reset_user_pass.name);
            return (0, message_1.default)(res, "Reset password verification sent.", true, 200);
        }
        catch (error) {
            console.log('Error:', error);
        }
    });
}
