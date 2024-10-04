import { Request, Response } from "express";
import { User } from "../../model/user";
import Message from "../../utils/message";
import { generateVerificationToken } from "../../utils/gen-verification-token";
import { sendVerificationEmail } from "../../nodemailer/send";

export default async function SendResetPassword(req: Request, res: Response) {

    const { email } = req.body;

    try {
        const reset_user_pass = await User.findOne({
            email,
            
        })

        if (!reset_user_pass) {
            return Message(res, "Coundn't find your account", false, 400)
        }

        const verificationToken = generateVerificationToken(); // Generate a verification token
        reset_user_pass.resetPasswordToken = verificationToken;
        reset_user_pass.resetPasswordExpiresAt = Date.now() + 3600000;

        reset_user_pass.save();
        
        sendVerificationEmail(email, verificationToken, reset_user_pass.name)
        
        return Message(res, "Reset password verification sent.", true, 200)

    } catch (error) {
        console.log('Error:', error)
    }
}