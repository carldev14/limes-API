import express from "express";
import Register from "../controllers/authController/register";
import VerifyEmail from "../controllers/authController/verify_email";
import Login from "../controllers/authController/login";
import Verify_ResetPassword from "../controllers/authController/verify-reset-password";
import SendResetPassword from "../controllers/authController/send-reset-password";
import { verifyToken } from "../middleware/verify-token";

import Logout from "../controllers/authController/log-out";
import { checkAuth } from "../controllers/authController/checkAuth";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/register", Register);

router.post("/login", Login);

router.post("/logout", Logout);

router.post("/verify-email", VerifyEmail);
router.post("/verify-reset-password", Verify_ResetPassword);
router.post("/send-reset-password", SendResetPassword);
export default router;
