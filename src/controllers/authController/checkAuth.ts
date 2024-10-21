import { Request, Response } from "express";
import { User } from "../../model/user";
import { error } from "console";

export const checkAuth = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(400).json({ success: false, error: "User not found" });
        }

        if(!user.isVerified) {
            return res.status(400).json({ success: false, error: 'User is not verified' });
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, error: error });
    }
};