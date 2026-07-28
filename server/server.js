const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../client")));

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