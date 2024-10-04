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
        const { code, email } = req.body;
        try {
            const user = yield user_1.User.findOne({
                verificationToken: code,
                email,
            });
            if (!user.verificationToken) {
                return (0, message_1.default)(res, "Invalid OTP provided.", false, 400);
            }
            if (user.verificationTokenExpiresAt.getTime() < Date.now()) {
                return (0, message_1.default)(res, "OTP has expired", false, 400);
            }
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiresAt = undefined;
            yield user.save(); // To save it to database
            return (0, message_1.default)(res, "Your email is now verified", true, 400);
        }
        catch (error) {
            return res.status(500).json({ message: "Internal server error", success: false });
        }
    });
}
