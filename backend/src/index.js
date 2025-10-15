import dotenv from "dotenv"
import express from "express"
import app from "./app.js"
import connectDb from "./db/index.js"

dotenv.config({
    path : "./.env"
});


const port = process.env.PORT || 3000

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`app listening on port http://localhost:${port}`);
    })
}).catch((error) => {
    console.log("DB connection error: ", error);
    process.exit(1)
})
