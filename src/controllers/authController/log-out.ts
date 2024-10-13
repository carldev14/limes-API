import { Request, Response } from "express";
import Message from "../../utils/message";

export default async function Logout(req: Request, res: Response) {
    res.clearCookie("token"); // clear the cookie stored
    return Message(res, "Logout successfully", true, 200)

}