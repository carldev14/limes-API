"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_user_data_1 = require("../controllers/get-method/get-user-data");
const verify_token_1 = require("../middleware/verify-token");
const router = express_1.default.Router();
router.get("/get-user-data", verify_token_1.verifyToken, get_user_data_1.GetUserData);
exports.default = router;
