import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async()=>{
    try {
        if(!ENV.DB_URL) {
            throw new Error("DB_url is not defined in the enviroment variables");
        }
        // console.log(ENV.DB_URL)
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("connected to database ", conn.connection.host);
    } catch (error) {
        console.error("db.js : error connecting to mongoD", error);
        process.exit(1) // 0 means success, 1 means failure
    }
}