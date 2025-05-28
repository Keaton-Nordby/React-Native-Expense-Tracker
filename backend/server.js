import express from "express";

const app = express();

app.get("/",(req, res) => {
    res.send("It's working");
});

app.listen(5001, () => {
    console.log("server is running on 5001");
});