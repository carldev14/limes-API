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

// List of allowed origins
const allowedOrigins = [
  "http://limes-tech.com",
  "http://localhost:3000",
  "https://spotty-moose-75.telebit.io",
  "http://192.168.1.10:3000",
  "https://limes.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows cookies to be sent with the request
  })
);

// Use the authentication routes
app.use("/api", authRoutes, UserRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, async () => {
  await ConnectDb();
  console.log(`running at ${PORT}`);
});
