import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5001;

async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Database compiled successfully")

    } catch (error) {
        console.log("Error compiling DB", error)
        process.exit(1) // status code one means failure and 0 means success
    }
}

app.get("/",(req, res) => {
    res.send("It's working1");
});

console.log("my port:", process.env.PORT);

initDB().then(() => {
    app.listen(port, () => {
    console.log(`server is running on ${port}`);
    });
});

