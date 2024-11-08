import { Request, Response } from "express";
import { User } from "../../model/user"; // Ensure the path is correct
import { hash } from "bcrypt";
import { generateVerificationToken } from "../../utils/gen-verification-token"; // Ensure this path is correct
import { RegisterFormInterface } from "../../types/form_interfaces"; // Ensure the path is correct
import { sendVerificationEmail } from "../../nodemailer/send";
import { generateTokenAndSetCookie } from "../../utils/gen-token-and-set-cookie";
import Message from "../../utils/message";

export default async function Register(req: Request, res: Response) {
  // Directly access req.body for the data
  const { email, password, username }: RegisterFormInterface = req.body;
  console.log(email, password, username);

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ success: false, error: "Fill up all the fields" });
  }

  try {
    req.headers["x-forwarded-for"];
    const clientIp = req.socket.remoteAddress;
    const checkEmail = await User.findOne({ email });
    const checkUsername = await User.findOne({ username });

    if (checkEmail) {
      console.log(clientIp);
      return res
        .status(400)
        .json({ success: false, error: "Email is already in use" });
    }

    if (checkUsername) {
      return res
        .status(400)
        .json({ success: false, error: "Username is already in use" });
    }

    const saltPassword = await hash(password, 10); // Hash the password
    const verificationToken = generateVerificationToken(); // Generate a verification token

    const reg_user = new User({
      ip_a: clientIp,
      email,
      password: saltPassword,
      username,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 300000, // 5 minutes
    });

    await reg_user.save();
    sendVerificationEmail(reg_user.email, verificationToken, reg_user.name);
    return Message(res, "Account created successfully", true, 201);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error ", success: false });
  }
}
