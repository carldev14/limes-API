import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { ConnectDb } from './db/connectDb';
import cookieParser from "cookie-parser";
import axios from 'axios';
const app = express();


app.use(express.json()); // allow json incoming
app.use(cookieParser()) // allow cookie incoming

app.use(cors({ origin: 'http://localhost:3000' }));

// Use the authentication routes
app.use('/api/auth', authRoutes);

app.get('/api/public-ip', async (req, res) => {
    try {
        const response = await axios.get('https://ifconfig.co/ip');
        res.json({ ip: response.data.trim() }); // Return the IP address
    } catch (error) {
        console.error('Error fetching IP:', error);
        return res.status(500).json({ error: 'Failed to fetch public IP' });
    }
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async() => {
    await ConnectDb();

    console.log(`Server is running on http://localhost:${PORT}`);
});
