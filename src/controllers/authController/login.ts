import { Request, Response } from "express";
import { User } from "../../model/user";
import { compare } from "bcrypt";
import { checkLockStatus } from "../../utils/check-if-user-lock";
import Message from "../../utils/message";
import { generateTokenAndSetCookie } from "../../utils/gen-token-and-set-cookie";

export default async function Login(req: Request, res: Response) {
    const { email, username, password } = req.body;
    
    const user = email || username;

    if (!user || !password) {
        return Message(res, "Fill up all the blanks ", false, 400);
        
    }
        try {
            // Find the user by either email or username using $or
            const log_user = await User.findOne({
                $or: [
                    { email: email },     // Check if email matches
                    { username: username } // Check if username matches

                ]
            });

            if (!log_user) {
                return Message(res, "Couldn't find your account", false, 400);
            }

            // Check if the user is locked
            if (checkLockStatus(log_user)) {
                return res.status(403).json({ message: 'Account is locked. Try again later after 30 minutes.' });
            }

            // Compare the password with the hashed password in the database
            const isPasswordValid = await compare(password, log_user.password);

            if (!isPasswordValid) {
                let MAX_ATTEMPTS = 3;

                // Increment failedAttempts by 1 atomically in MongoDB
                await User.updateOne(
                    { _id: log_user._id },
                    {
                        $inc: { failedAttempts: 1 }  // Increment failedAttempts
                    }
                );

                // Re-fetch the user to get the updated failedAttempts value
                const updatedUser = await User.findById(log_user._id);
                const remainingChances = MAX_ATTEMPTS - updatedUser.failedAttempts;

                // If failedAttempts reaches 3, lock the account
                if (updatedUser.failedAttempts >= 3) {
                    updatedUser.lockUntil = new Date(Date.now() + 30 * 60 * 1000);  // Lock for 30 minutes
                    await updatedUser.save();  // Save lockUntil field

                    return Message(res, "Account was locked due to too many failed attempts", false, 400);
                }

                return Message(res, `Invalid credentials. You have ${remainingChances} remaining chances`, false, 400);
            }

            // Check if the user is verified
            if (!log_user.isVerified) {
                return Message(res, "Your email is not verified", false, 400);
            }

            // Reset failed attempts after successful login
            log_user.failedAttempts = 0;
            log_user.lockUntil = null;

            // Generate token and set cookie
            generateTokenAndSetCookie(res, log_user._id);

            // Update last login time
            log_user.lastLogin = new Date();

            await log_user.save();  // Save the reset state and last login time

            return Message(res, "You logged in successfully", true, 200);

        } catch (error) {
            return res.status(500).json({ message: "Internal server error", success: false });
        }
}
