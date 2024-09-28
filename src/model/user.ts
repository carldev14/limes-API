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
    ip_a: string,
}

const userSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
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
