const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "database.db");
const db = new DatabaseSync(dbPath);

// Run schema on startup (safe to run every time, uses IF NOT EXISTS)
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
db.exec(schema);

// Migration: add status column if it doesn't exist yet (for databases created before this feature)
const columns = db.prepare("PRAGMA table_info(bookings)").all();
const hasStatus = columns.some(col => col.name === "status");

if (!hasStatus) {
    db.exec("ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'booked'");
    console.log("Migrated: added status column to bookings table");
}

module.exports = db;