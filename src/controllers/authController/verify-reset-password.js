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
exports.default = Verify_ResetPassword;
const user_1 = require("../../model/user");
const message_1 = __importDefault(require("../../utils/message"));
function Verify_ResetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, email, new_password } = req.body;
        try {
            const verify_user_reset = yield user_1.User.findOne({
                email,
                resetPasswordToken: code,
            });
            if (!verify_user_reset.resetPasswordToken) {
                return (0, message_1.default)(res, "Invalid token provided", false, 400);
            }
            if (!verify_user_reset.resetPasswordExpiresAt) {
                return (0, message_1.default)(res, "Token is expired", false, 400);
            }
            verify_user_reset.password = new_password;
            verify_user_reset.save();
            return (0, message_1.default)(res, "You successfully reset your password", false, 201);
        }
        catch (error) {
            console.log("Error", error);
        }
    });
}
