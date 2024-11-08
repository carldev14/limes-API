import { Request, Response } from "express";
import { User } from "../../model/user";
import Message from "../../utils/message";

export default async function VerifyEmail(req: Request, res: Response) {
  const { otpCode } = req.body;
  console.log(otpCode, req.userId);

  try {
    const user = await User.findOne({
      verificationToken: otpCode,
      _id: req.userId,
    });

    // Check if the user exists
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid OTP provided", success: false });
    }

    // Check if the verification token is present
    if (!user.verificationToken) {
      return res
        .status(400)
        .json({ error: "Invalid OTP provided", success: false });
    }

    // Check if the OTP has expired
    if (user.verificationTokenExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        error: "OTP are expired. ",
        success: false,
      });
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
