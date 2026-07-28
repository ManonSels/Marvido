const express = require("express");
const router = express.Router();
const db = require("../database/database");

router.get("/availability", (req, res) => {
    const bookings = db.prepare("SELECT start_date, end_date FROM bookings").all();
    res.json(bookings);
});

router.get("/prices", (req, res) => {
    const prices = db.prepare("SELECT start_date, end_date, price_per_night FROM prices").all();
    res.json(prices);
});

router.get("/test", (req, res) => {
    res.json({ message: "Server works!" });
});

module.exports = router;