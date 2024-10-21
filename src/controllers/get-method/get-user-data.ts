import { Request, Response } from "express";
import { User } from "../../model/user";

export async function GetUserData(req: Request, res: Response) {
  try {
    const user = await User.findById({
      _id: req.userId,
    });
    const readableCreatedAt = new Date(user.createdAt).toLocaleString();
    const readableLastLogIn = new Date(user.lastLogin).toLocaleString();

    return res.json({
      user: {
        username: user.username,
        email: user.email,
        isverified: user.isVerified,
        lastlogin: readableLastLogIn,
        createdAt: readableCreatedAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
