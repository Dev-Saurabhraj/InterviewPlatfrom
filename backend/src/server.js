import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
const __dirname = path.resolve();

const app = express();
app.get('/', (req, res)=>{
    res.status(200).json({msg: "success from api"});

})

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}", (req, res)=> {res.sendFile(
        path.join(__dirname, "../frontend", "dist", "index.html"));
})
}
app.listen(ENV.PORT, ()=> console.log("server is running on port : "+ ENV.PORT));