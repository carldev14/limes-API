export function generateVerificationToken() {
    const verificationtoken = Math.floor(100000 + Math.random() * 900000).toString();
    return verificationtoken
}