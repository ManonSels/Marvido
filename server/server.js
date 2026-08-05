const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(compression()); // gzip/brotli-compress responses (HTML, CSS, JS, JSON) — big win for initial load
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../client"), {
    maxAge: "1d", // default cache for everything (HTML/JS/CSS get shorter cache so updates show up)
    setHeaders: (res, filePath) => {
        // Videos and images rarely change once uploaded — cache them hard.
        // "immutable" tells the browser: don't even bother re-checking, just use the cached copy.
        if (filePath.match(/\.(mp4|webm|webp|jpg|jpeg|png|svg|woff2?)$/)) {
            res.setHeader("Cache-Control", "public, max-age=2592000, immutable"); // 30 days
        }
    }
}));

const authRoutes = require("./routes/authRoutes");
const { requireAdmin } = require("./middleware/auth");
const adminRoutes = require("./routes/admin");
const adminPricesRoutes = require("./routes/adminPrices");
const apiRoutes = require("./routes/api");

app.use("/api/auth", authRoutes);
app.use("/api/admin", requireAdmin, adminRoutes);
app.use("/api/admin", requireAdmin, adminPricesRoutes);
app.use("/api", apiRoutes);

app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});