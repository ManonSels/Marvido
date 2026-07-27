CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    note TEXT,
    status TEXT DEFAULT 'booked',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);