"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Message;
function Message(res, message_value, success_value, status_value) {
    res.status(status_value).json({ message: message_value, success: success_value });
}
