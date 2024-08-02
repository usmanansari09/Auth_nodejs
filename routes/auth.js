// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");

// Register a new user
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        let usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.status(400).json({ msg: "Username already exists" });
        }

        user = new User({ username, email, password });
        await user.save();

        const payload = { userId: user.id };
        const token = jwt.sign(payload, config.get("JWT_SECRET"), {
            expiresIn: config.get("JWT_EXPIRES_IN"),
        });

        res.json({ token, 'status': true, username, email });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, config.get("JWT_SECRET"), {
            expiresIn: config.get("JWT_EXPIRES_IN"),
        });

        res.json({ token, 'status': true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
module.exports = router;
