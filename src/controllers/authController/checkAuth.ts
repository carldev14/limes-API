import { Request, Response } from "express";
import { User } from "../../model/user";

export const checkAuth = async (req: Request, res: Response) => {
  try {
    // Assuming req.userId is set by some authentication middleware
    const user = await User.findById(req.userId).select("-password");

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found", isUserFound: false });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(200)
        .json({ success: true, isEmailVerified: false, isUserFound: true });
    }

    // If the user is found and verified
    res
      .status(200)
      .json({ success: true, isEmailVerified: true, isUserFound: true });
  } catch (err) {
    console.error("Error in checkAuth:", err); // Changed to console.error for better logging
    res.status(500).json({ success: false, error: "Internal server error" }); // Generic error response
  }
};
