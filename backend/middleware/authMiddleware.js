const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  const decoded = jwt.verify(token, "secretkey");

  const user = await User.findByPk(decoded.id);

  req.user = user;

  next();
};