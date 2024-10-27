import { Request, Response } from "express";
import { User } from "../../model/user";
import Message from "../../utils/message";

export default async function VerifyEmail(req: Request, res: Response) {
  const { code } = req.body;
  console.log(code, req.userId);

  try {
    const user = await User.findOne({
      verificationToken: code,
      _id: req.userId
    });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "User not found or invalid OTP provided", success: false });
    }

    // Check if the verification token is present
    if (!user.verificationToken) {
      return res.status(400).json({ error: "Invalid OTP provided", success: false });
    }

    // Check if the OTP has expired
    if (user.verificationTokenExpiresAt.getTime() < Date.now()) {
      return Message(res, "OTP has expired", false, 400);
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save(); // Save the updated user
    return Message(res, "Your email is now verified", true, 200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}
