// express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string; // or the appropriate type if you're using a different type for userId
    }
  }
}
