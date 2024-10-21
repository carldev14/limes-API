import express from "express";
import { GetUserData } from "../controllers/get-method/get-user-data";
import { verifyToken } from "../middleware/verify-token";

const router = express.Router();

router.get("/get-user-data", verifyToken, GetUserData);

export default router;
