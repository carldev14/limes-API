import nodemailer from 'nodemailer';

import { VERIFICATION_EMAIL_TEMPLATE } from './templates';
import { EMAIL, PASSWORD } from '../config/dotenv';


// Create a Nodemailer transporter using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});

export async function sendVerificationEmail(email: string, verificationToken: string, name: string) {
    try {

        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: 'Please verify your email',

            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken)
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Verification email sent successfully',
        };
    } catch (error) {
        console.error('Error sending email:', error);

        return {
            success: false,
            message: 'Failed to send verification email',
        };
    }
}
