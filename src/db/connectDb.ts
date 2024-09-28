import { connect } from "mongoose";
import { MONGODB_URI } from "../config/dotenv";
export async function ConnectDb() {
    try {
        await connect(MONGODB_URI)
    } catch (error) {
        console.log('Error connecting database', error)
    }
}