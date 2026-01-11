import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import cors from "cors";
import serve from "inngest/express"
import {inngest, functions} from "./lib/inngest.js"
import { connectDB } from "./lib/db.js";
const __dirname = path.resolve();

const app = express();
// middle wares
app.use(express.json())
// cross origin request handling
app.use(cors({origin:ENV.CLIENT_URL, credentials: true}))

// inngest connect clerk to mongodb so that we can delete and create user 
app.use("/api/inngest", serve({client: inngest, functions}))


app.get('/', (req, res) => {
    res.status(200).json({ msg: "success from api" });

})

if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(
            path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

// fucntion to start the server first call function connectDB then start the server
const startServer = async()=>{
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log("server is running on port : " + ENV.PORT)
        });

    } catch (error) {
        console.error("Error:  when starting the server", error);

    }
}

startServer();