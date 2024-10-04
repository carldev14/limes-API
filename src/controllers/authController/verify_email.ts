import { Request, Response } from "express";
import { User } from "../../model/user";
import Message from "../../utils/message";

export default async function VerifyEmail(req: Request, res: Response) {
    const { code, email } = req.body;

    try {

        const user = await User.findOne({
            verificationToken: code,
            email,
        })

        if (!user.verificationToken) {
            return Message(res, "Invalid OTP provided.", false, 400)

        }

        if (user.verificationTokenExpiresAt.getTime() < Date.now()) {
            return Message(res, "OTP has expired", false, 400)
           
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save(); // To save it to database
        return Message(res, "Your email is now verified", true, 400)
      

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}