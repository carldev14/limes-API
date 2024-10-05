import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { ConnectDb } from './db/connectDb';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import { PORT } from './config/dotenv';
import http from 'http'; // Import http module
import socketRoutes from './routes/socket.routes'; // Import your new route

const app = express();

// Allow JSON and cookie parsing
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);
// Enable CORS
app.use(cors({ origin: 'http://localhost:3000' }));

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Use the socket routes
app.use('/api/socket', socketRoutes);

// Route to get the public IP address


// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, async () => {
    await ConnectDb();
});

// Export the server instance
export { server };
