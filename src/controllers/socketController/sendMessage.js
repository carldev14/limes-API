"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessages = sendMessages;
const index_1 = require("../../index"); // Import the server instance
const message_1 = __importDefault(require("../../utils/message"));
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(index_1.server, {
    cors: {
        origin: 'http://localhost:3000', // Adjust this based on your frontend
        methods: ['GET', 'POST'],
    },
});
// Set up the connection listener once
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('chat message', (msg) => {
        console.log('Message received: ' + msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
function sendMessages(req, res) {
    const { message, _id } = req.body;
    if (!message) {
        return (0, message_1.default)(res, "Message is blank", false, 400);
    }
    // Emit the message to all connected clients
    io.emit('chat message', message);
    return (0, message_1.default)(res, "Message sent successfully", true, 200);
}
