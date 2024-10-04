import { Request, Response } from "express";
import { User } from "../../model/user"; // Ensure the path is correct
import { hash } from 'bcrypt';
import { generateVerificationToken } from "../../utils/gen-verification-token"; // Ensure this path is correct
import { RegisterFormInterface } from "../../types/register_formData"; // Ensure the path is correct
import { sendVerificationEmail } from "../../nodemailer/send";
import { generateTokenAndSetCookie } from "../../utils/gen-token-and-set-cookie";
import Message from "../../utils/message";
import axios from "axios";



export default async function Register(req: Request, res: Response) {
    // Directly access req.body for the data
    const data = req.body;
    const { email, password, username }: RegisterFormInterface = data;

    if (!email || !password || !username) {
        return Message(res, 'Fill up all the blanks', false, 400)
    }
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const checkEmail = await User.findOne({ email });
        const checkUsername = await User.findOne({ username });

        if (checkEmail) {
            console.log(clientIp)
            return Message(res, "The email is already in use", false, 400)
        }
        
        if (checkUsername) {
            return Message(res, "The username is already in use", false, 400)
        }

        const saltPassword = await hash(password, 10); // Hash the password
        const verificationToken = generateVerificationToken(); // Generate a verification token

        const reg_user = new User({

            email,
            password: saltPassword,
            username,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 3600000 // 1 hour
        });


        await reg_user.save();
        sendVerificationEmail(reg_user.email, verificationToken, reg_user.name)
        generateTokenAndSetCookie(res, reg_user._id)

        return Message(res, "User created successfully", true, 201)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error ", success: false });
    }
}
