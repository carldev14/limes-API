import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { ConnectDb } from "./db/connectDb";
import cookieParser from "cookie-parser";
import { PORT } from "./config/dotenv";
import http from "http"; // Import http module
import UserRoutes from "./routes/user.routes";

const app = express();

// Allow JSON and cookie parsing
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

const corsOptions = {
  origin: 'limes.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the methods you need
  allowedHeaders: ['*'], // Adjust as needed
};

app.use(cors(corsOptions));

// Use the authentication routes
app.use("/api", authRoutes, UserRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, async () => {
  await ConnectDb();
  console.log(`running at ${PORT}`);
});
