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
  "https://limes.vercel.app", // Vercel frontend
  "http://localhost:3000", // Local development (if applicable)
];
app.options('*', cors()); // Allow preflight requests

app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming Origin: ", origin); // Log the incoming origin
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// Use the authentication routes
app.use("/api", authRoutes, UserRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, async () => {
  await ConnectDb();
  console.log(`running at ${PORT}`);
});
