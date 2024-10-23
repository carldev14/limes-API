import { Request, Response } from "express";
import { User } from "../../model/user";
import { dateFormat } from "../../utils/dateFormat";

export async function GetUserData(req: Request, res: Response) {
  try {
    const user = await User.findById({
      _id: req.userId,
    });



    // Convert createdAt and lastLogin to readable formats
    const readableCreatedAt = new Date(user.createdAt).toLocaleDateString('en-US', dateFormat);

    return res.json({
      user: {
        username: user.username,
        email: user.email,
        isverified: user.isVerified,
        lastlogin: user.lastLogin,
        createdAt: readableCreatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
