const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: "No token" });
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};