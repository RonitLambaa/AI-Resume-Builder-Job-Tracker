import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

//basic config
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

//cors config

app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods : ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders : ["Content-Type", "Authorization"]
}))

import healthCheck from "./controllers/healthcheck.controller.js";
import authRouter from "./routes/auth.routes.js"
import resumeRouter from "./routes/resumes.routes.js"
import jobsRouter from "./routes/jobs.routes.js"
import aiRouter from "./routes/ai.routes.js";

app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/healthcheck", healthCheck)
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/jobs", jobsRouter);


app.get("/", (req, res) => {
    // console.log("hello");
    res.send("Hello World!");
    
})

export default app
