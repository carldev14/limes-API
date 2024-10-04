import { Request, Response } from "express";
import { server } from '../../index'; // Import the server instance
import Message from "../../utils/message";
import { Server } from 'socket.io';

const io = new Server(server, {
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

export function sendMessages(req: Request, res: Response) {
    const { message, _id } = req.body;

    if (!message) {
        return Message(res, "Message is blank", false, 400);
    }

    // Emit the message to all connected clients
    io.emit('chat message', message);
    
    return Message(res, "Message sent successfully", true, 200);
}
