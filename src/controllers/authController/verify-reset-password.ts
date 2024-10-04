import { Request, Response } from "express";
import { User } from "../../model/user";
import Message from "../../utils/message";

export default async function Verify_ResetPassword(req: Request, res: Response) {
    const { code, email, new_password } = req.body;
    try {
        const verify_user_reset = await User.findOne({
            email,
            resetPasswordToken: code,
        })

        if (!verify_user_reset.resetPasswordToken) {
            return Message(res, "Invalid token provided", false, 400)
        }

        if (!verify_user_reset.resetPasswordExpiresAt) {
            return Message(res, "Token is expired", false, 400)
        }

        verify_user_reset.password = new_password

        verify_user_reset.save();

        return Message(res, "You successfully reset your password", false, 201)

    } catch (error) {
        console.log('Error', error)
    }
}