import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/crons.js"

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();

// middleware
app.use(rateLimiter);  
app.use(express.json());

const port = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "okay"});
});



// if we get a request to use this use the transactionsroute file
app.use("/api/transactions", transactionsRoute);

console.log("my port:", process.env.PORT);

initDB().then(() => {
    app.listen(port, '0.0.0.0', () => {
    console.log(`server is running on ${port}`);
    });
});



