import express from "express"
import { createTransaction, deleteTransaction, getSummaryByUserId, getTransactionsByUserId } from "../controllers/transactionsController.js";

const router = express.Router();

// api endpoints
router.get("/summary/:userId", getSummaryByUserId)

router.get("/:userId" , getTransactionsByUserId)

router.post("/", createTransaction)

router.delete("/:id", deleteTransaction)

export default router;