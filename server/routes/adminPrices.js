const express = require("express");
const router = express.Router();
const db = require("../database/database");

function rangesOverlap(startA, endA, startB, endB) {
    return startA <= endB && startB <= endA;
}

function findPriceOverlap(start_date, end_date, excludeId = null) {
    const all = db.prepare("SELECT * FROM prices").all();
    return all.find(p => {
        if (excludeId && p.id == excludeId) return false;
        return rangesOverlap(start_date, end_date, p.start_date, p.end_date);
    });
}

router.get("/prices", (req, res) => {
    const prices = db.prepare("SELECT * FROM prices ORDER BY start_date DESC").all();
    res.json(prices);
});

router.post("/prices", (req, res) => {
    const { start_date, end_date, price_per_night } = req.body;

    if (!start_date || !end_date || !price_per_night) {
        return res.status(400).json({ error: "start_date, end_date, and price_per_night are required" });
    }

    const overlap = findPriceOverlap(start_date, end_date);
    if (overlap) {
        return res.status(409).json({
            error: `These dates already have a price set (${overlap.start_date} → ${overlap.end_date}, €${overlap.price_per_night}/night)`
        });
    }

    const stmt = db.prepare(`
        INSERT INTO prices (start_date, end_date, price_per_night)
        VALUES (?, ?, ?)
    `);

    const result = stmt.run(start_date, end_date, price_per_night);

    res.json({ id: result.lastInsertRowid, start_date, end_date, price_per_night });
});

router.put("/prices/:id", (req, res) => {
    const { id } = req.params;
    const { start_date, end_date, price_per_night } = req.body;

    if (!start_date || !end_date || !price_per_night) {
        return res.status(400).json({ error: "start_date, end_date, and price_per_night are required" });
    }

    const overlap = findPriceOverlap(start_date, end_date, id);
    if (overlap) {
        return res.status(409).json({
            error: `These dates already have a price set (${overlap.start_date} → ${overlap.end_date}, €${overlap.price_per_night}/night)`
        });
    }

    db.prepare(`
        UPDATE prices
        SET start_date = ?, end_date = ?, price_per_night = ?
        WHERE id = ?
    `).run(start_date, end_date, price_per_night, id);

    res.json({ success: true });
});

router.delete("/prices/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM prices WHERE id = ?").run(id);
    res.json({ success: true });
});

module.exports = router;