const express = require("express");
const router = express.Router();
const db = require("../database/database");

const VALID_STATUSES = ["paid", "deposit", "blocked", "not_available"];

function rangesOverlap(startA, endA, startB, endB) {
    return startA <= endB && startB <= endA;
}

function findOverlap(start_date, end_date, excludeId = null) {
    const all = db.prepare("SELECT * FROM bookings").all();
    return all.find(b => {
        if (excludeId && b.id == excludeId) return false;
        return rangesOverlap(start_date, end_date, b.start_date, b.end_date);
    });
}

// Get all bookings, furthest in the future first
router.get("/bookings", (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings ORDER BY start_date DESC").all();
    res.json(bookings);
});

// Add a new booking
router.post("/bookings", (req, res) => {
    const { start_date, end_date, note, status } = req.body;

    if (!start_date || !end_date) {
        return res.status(400).json({ error: "start_date and end_date are required" });
    }

    const finalStatus = VALID_STATUSES.includes(status) ? status : "booked";

    const overlap = findOverlap(start_date, end_date);
    if (overlap) {
        return res.status(409).json({
            error: `These dates overlap with an existing booking (${overlap.start_date} → ${overlap.end_date})`
        });
    }

    const stmt = db.prepare(`
        INSERT INTO bookings (start_date, end_date, note, status)
        VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(start_date, end_date, note || null, finalStatus);

    res.json({ id: result.lastInsertRowid, start_date, end_date, note, status: finalStatus });
});

// Edit an existing booking (dates, note, and/or status)
router.put("/bookings/:id", (req, res) => {
    const { id } = req.params;
    const { start_date, end_date, note, status } = req.body;

    if (!start_date || !end_date) {
        return res.status(400).json({ error: "start_date and end_date are required" });
    }

    const finalStatus = VALID_STATUSES.includes(status) ? status : "booked";

    const overlap = findOverlap(start_date, end_date, id);
    if (overlap) {
        return res.status(409).json({
            error: `These dates overlap with an existing booking (${overlap.start_date} → ${overlap.end_date})`
        });
    }

    db.prepare(`
        UPDATE bookings
        SET start_date = ?, end_date = ?, note = ?, status = ?
        WHERE id = ?
    `).run(start_date, end_date, note || null, finalStatus, id);

    res.json({ success: true });
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