import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import cors from "cors";
import {serve} from "inngest/express"
import {inngest, functions} from "./lib/inngest.js"
import { connectDB } from "./lib/db.js";
import {clerkMiddleware} from'@clerk/express'
import { protectRoute } from "./middlewares/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
const __dirname = path.resolve();

const app = express();
// middle wares
app.use(express.json())
// cross origin request handling
app.use(cors({origin:ENV.CLIENT_URL, credentials: true}))

// using clerk middleware to protech routes
app.use(clerkMiddleware());
// inngest connect clerk to mongodb so that we can delete and create user 
// adds auth field to req object:  req.auth
app.use("/api/inngest", serve({client: inngest, functions}))

app.use("/api/chat", chatRoutes);

app.get('/', (req, res) => {

    res.status(200).json({ message: "success from api" });

})
app.get("/health", (req, res)=>{
    req.auth
    res.status(200).json({message: "api is running and up"});
})

app.get("/video-calls",  protectRoute, (req, res)=>{
    req.auth
    res.status(200).json({message: "this is the video class end point"});
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