import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { ConnectDb } from "./db/connectDb";
import cookieParser from "cookie-parser";
import { PORT } from "./config/dotenv";
import UserRoutes from "./routes/user.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.10:3000",
  "https://limes.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Origin:', origin); // Log the incoming origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Use routes
app.use("/api", authRoutes, UserRoutes);

// Start the server
app.listen(4000, async () => {
  await ConnectDb();
  console.log(`Server running at http://192.168.1.10:${PORT}/`);
});