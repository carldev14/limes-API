import { Request, Response } from "express";
import { User } from "../model/user";
import { compare } from "bcrypt";
import Message from "../utils/message";
import { generateTokenAndSetCookie } from "../utils/gen-token-and-set-cookie";

export default async function Login(req: Request, res: Response) {
    const formData = req.body;
    const { email, password } = formData;
    console.log(email, password)
    try {
        
        const log_user = await User.findOne({
            email
        })

        if (!log_user) {
            return Message(res, "Coundn't find your account", false, 400)
        }

        const isPasswordValid = compare(password, log_user.password)

        if (!isPasswordValid) {
            return Message(res, "Invalid credentials", false, 400)
        }

        if (log_user.isVerified === false) {
            return Message(res, "Your email are not verified", false, 400)
        }

        generateTokenAndSetCookie(res, log_user._id)

        log_user.lastLogin = Date.now();

        await log_user.save()

        return Message(res, "You logged in successfully", true, 200)

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });

    }

}