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
        // Assuming req.userId is set by some authentication middleware
        const user = yield user_1.User.findById(req.userId).select("-password");
        // Check if the user exists
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: "User not found", isUserFound: false });
        }
        // Check if the user is verified
        if (!user.isVerified) {
            return res
                .status(200)
                .json({ success: true, isEmailVerified: false, isUserFound: true });
        }
        // If the user is found and verified
        res
            .status(200)
            .json({ success: true, isEmailVerified: true, isUserFound: true });
    }
    catch (err) {
        console.error("Error in checkAuth:", err); // Changed to console.error for better logging
        res.status(500).json({ success: false, error: "Internal server error" }); // Generic error response
    }
});
exports.checkAuth = checkAuth;
