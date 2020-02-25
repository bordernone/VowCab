const express = require('express');
const app = express();

app.get("/api", (req, res) => {
    res.send("Hello World");
});

app.listen(3001, () => {
    console.log("listening to port 3001");
});