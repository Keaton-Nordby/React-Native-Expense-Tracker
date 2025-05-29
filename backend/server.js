import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

// built in middleware
app.use(express.json());

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

app.get("/api/transactions/:userId" , async (req, res) => {
    try {
        const { userId } = req.params
        
        const transactions = await sql `
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;

        res.status(200).json(transactions);

    } catch(error) {
        console.log("Error getting the transaction", error)
        res.status(500).json({message: 'Internal error'})
    }
})

app.post("/api/transactions", async (req, res) => {
    // for sending transactions we want title, amount, category, user_id
    try {
        const { title, amount, category, user_id} = req.body

        if(!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({message: "All fields are required"});
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `;

        res.status(201).json(transaction[0])
        
    } catch (error) {
        console.log("Error creating the transaction", error)
        res.status(500).json({message: 'Internal error'})
    }
})

app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const { iD } = req.params

        const deletion = await sql `
        DELETE FROM transactions WHERE id = ${iD}
        `;

        res.status(200).json({message: "Deletion was successful"});
        
    } catch (error) {
        console.log("Error deleting the transaction", error)
        res.status(500).json({message: 'Internal error'})
    }
})


console.log("my port:", process.env.PORT);

initDB().then(() => {
    app.listen(port, () => {
    console.log(`server is running on ${port}`);
    });
});



