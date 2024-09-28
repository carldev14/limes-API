import express from 'express'
import Register from '../authController/register';
import VerifyEmail from '../authController/verify_email';
import Login from '../authController/login';
import Verify_ResetPassword from '../authController/verify-reset-password';
import SendResetPassword from '../authController/send-reset-password';

const router = express.Router();

router.post("/register", Register)

router.post("/login", Login)

router.post("/logout",)
router.post("/verify-email", VerifyEmail)
router.post("/verify-reset-password", Verify_ResetPassword)
router.post("/send-reset-password", SendResetPassword)
export default router;