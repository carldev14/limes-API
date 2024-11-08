import { Request, Response } from "express";
import { User } from "../../model/user";
import { generateVerificationToken } from "../../utils/gen-verification-token";
import Message from "../../utils/message";
import { sendVerificationEmail } from "../../nodemailer/send";

export default async function (req: Request, res: Response) {
  const { isResend } = req.body;

  try {
    if (isResend) {
      if (!req.userId) {
        return res.status(400).json({ error: "User ID is missing", success: false });
      }
      
      const user = await User.findOne({ _id: req.userId });
      if (!user) {
        return res.status(404).json({ error: "User not found", success: false });
      }
      // if user are already verified, don't allow any request for resending verify email
      if (user.isVerified) {
        return res.status(401).json({
          success: false,
          error:
            "You are already verified",
        });
      }
      // Set a default expiration date if verificationTokenExpiresAt is undefined
      if (!user.verificationTokenExpiresAt) {
        user.verificationTokenExpiresAt = new Date(0); // Set to past date
      }

      if (user.verificationTokenExpiresAt.getTime() > Date.now()) {
        return res.status(401).json({
          success: false,
          error:
            "Your OTP has not expired yet. Please wait for about 5 minutes.",
        });
      }

      // Generate a new verification token and update expiration
      const newToken = generateVerificationToken();
      user.verificationToken = newToken;
      user.verificationTokenExpiresAt = new Date(Date.now() + 300000);
      await user.save(); // Save updated user
      sendVerificationEmail(user.email, newToken, user.name);
      return Message( 
        res,
        "Sent new OTP to your email. Kindly check and enter it here",
        true,
        200
      );
    } else {
      return res.status(400).json({
        success: false,
        error: "An unexpected error occurred. If this issue persists, please contact support or your developer for assistance."
      })
    }
  } catch (error) {
    console.error("Error in resend verification:", error); // Log error
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
}
