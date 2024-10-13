import {  Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/dotenv'; // Import your secret

// ... (Rest of your Express setup)
interface CustomJwtPayload extends JwtPayload {

    userId: string; // Define userId as a string

}

export default function verifyToken(req: Request, res: Response) {
    const { token } = req.body; // Access cookie from request

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

        req.userId = decoded.userId;

        return res.status(200).json({ success: true, message: 'Success' });


    } catch (error) {
        console.error('Error in verifyToken ', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};