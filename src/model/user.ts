// models/user.ts
import { Document, model, Schema } from 'mongoose';
import mongoose from 'mongoose';
export interface User extends Document {
    email: string;
    password: string;
    username: string;
    lastLogin: Date;
    isVerified: boolean; // Ensure this matches the schema
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
    ip_a: string;
    failedAttempts: number;
    lockUntil: Date;
}

const userSchema = new Schema<User>({
    email: {
        type: String,

        unique: true
    },
    password: {
        type: String,

        unique: true
    },
    username: {
        type: String,

        unique: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: { // Ensure this matches the schema
        type: Boolean,
        default: false
    },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    ip_a: String,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date
}, {
    timestamps: true
});

// Check if the model already exists before creating it
export const User = mongoose.models.User || model<User>('User', userSchema);
