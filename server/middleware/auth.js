const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
    const token = req.cookies.admin_token;

    if (!token) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired session" });
    }
}

module.exports = { requireAdmin };