const express = require("express");
const router = express.Router();
const db = require("../database/database");

// Get all bookings
router.get("/bookings", (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings ORDER BY start_date").all();
    res.json(bookings);
});

// Add a new booking
router.post("/bookings", (req, res) => {
    const { start_date, end_date, note } = req.body;

    if (!start_date || !end_date) {
        return res.status(400).json({ error: "start_date and end_date are required" });
    }

    const stmt = db.prepare(`
        INSERT INTO bookings (start_date, end_date, note)
        VALUES (?, ?, ?)
    `);

    const result = stmt.run(start_date, end_date, note || null);

    res.json({ id: result.lastInsertRowid, start_date, end_date, note });
});

// Delete a booking
router.delete("/bookings/:id", (req, res) => {
    const { id } = req.params;

    db.prepare("DELETE FROM bookings WHERE id = ?").run(id);

    res.json({ success: true });
});

// Simple check used by the frontend to verify session is still valid
router.get("/test", (req, res) => {
    res.json({ message: "Admin route works, you are logged in!" });
});

module.exports = router;