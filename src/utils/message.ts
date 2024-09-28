import { Response } from "express";

export default function Message(res: Response, message_value: string, success_value: boolean, status_value: number) {
    res.status(status_value).json({ message: message_value, success: success_value })
}