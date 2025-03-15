const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send('<form action="/login" method="POST"><input type="text" name="username"><input type="password" name="password"><button type="submit">Login</button></form>');
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "password") {
        res.send("Login successful!");
    } else {
        res.send("Invalid credentials.");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
