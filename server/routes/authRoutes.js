const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: "Password required" });
    }

    const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (!isValid) {
        return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "12h"
    });

    res.cookie("admin_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 12 * 60 * 60 * 1000 // 12 hours
    });

    res.json({ success: true });
});

router.post("/logout", (req, res) => {
    res.clearCookie("admin_token");
    res.json({ success: true });
});

module.exports = router;