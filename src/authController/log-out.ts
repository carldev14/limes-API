import { Request, Response } from "express";

export default async function LogOut(req: Request, res: Response) {
    res.clearCookie("token");
    return
}