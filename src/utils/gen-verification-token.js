"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = generateVerificationToken;
function generateVerificationToken() {
    const verificationtoken = Math.floor(100000 + Math.random() * 900000).toString();
    return verificationtoken;
}
