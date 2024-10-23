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
exports.GetUserData = GetUserData;
const user_1 = require("../../model/user");
const dateFormat_1 = require("../../utils/dateFormat");
function GetUserData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.User.findById({
                _id: req.userId,
            });
            // Convert createdAt and lastLogin to readable formats
            const readableCreatedAt = new Date(user.createdAt).toLocaleDateString('en-US', dateFormat_1.dateFormat);
            return res.json({
                user: {
                    username: user.username,
                    email: user.email,
                    isverified: user.isVerified,
                    lastlogin: user.lastLogin,
                    createdAt: readableCreatedAt,
                },
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
