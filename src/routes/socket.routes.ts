import express from 'express'
import { sendMessages } from '../controllers/socketController/sendMessage'


const router = express.Router();

router.post("/send-messages", sendMessages)


export default router;