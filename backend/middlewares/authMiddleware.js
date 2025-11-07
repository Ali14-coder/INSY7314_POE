// server/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

// In-memory blacklist (non-persistent)
const tokenBlacklist = new Set();

// Optional: replace with Redis-based blacklist for production
// const Redis = require('ioredis');
// const redis = new Redis(process.env.REDIS_URL);

// helper (sync) - using Set
const isBlacklisted = (token) => tokenBlacklist.has(token);

// verifyToken middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    if (isBlacklisted(token)) return res.status(401).json({ message: "Token invalidated" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });

      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };
      next();
    });
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(500).json({ message: "Authentication error" });
  }
};

// authorizeRole middleware
const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

// invalidate token (logout)
const invalidateToken = (token) => {
  if (!token) return;
  tokenBlacklist.add(token);
  // NOTE: tokenBlacklist is in-memory and will be cleared on restart.
  // For production, store blacklist entry in Redis with TTL = token expiry.
};

module.exports = { verifyToken, authorizeRole, invalidateToken };