"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const connectDb_1 = require("./db/connectDb");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("./config/dotenv");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", true);
// CORS setup
const allowedOrigins = [
    "http://localhost:3000",
    "http://192.168.1.10:3000",
    "https://limes.vercel.app"
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        console.log('Origin:', origin); // Log the incoming origin
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
// Use routes
app.use("/api", auth_routes_1.default, user_routes_1.default);
// Start the server
app.listen(4000, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connectDb_1.ConnectDb)();
    console.log(`Server running at http://192.168.1.10:${dotenv_1.PORT}/`);
}));
