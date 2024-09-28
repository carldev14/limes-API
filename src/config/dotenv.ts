import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const PORT = process.env.PORT!;
export const EMAIL = process.env.EMAIL!;
export const PASSWORD = process.env.PASSWORD!;
export const MONGODB_URI = process.env.MONGODB_URI!
export const JWT_SECRET = process.env.JWT_SECRET!
export const NODE_ENV = process.env.NODE_ENV!

