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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const user_1 = require("../../model/user");
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, error: "User not found" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ success: false, error: 'User is not verified' });
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, error: error });
    }
});
exports.checkAuth = checkAuth;
