const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Handle "Bearer <token>" or raw "<token>"
  if (token.startsWith("Bearer ")) {
    token = token.slice(7); // remove "Bearer " prefix
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token." });
  }
}

module.exports = auth;