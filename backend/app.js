// server/app.js
const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const sanitize = require("mongo-sanitize");
const securityMiddlewares = require("./middlewares/securityMiddleware.js");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const authRoute = require("./routes/authRoute.js");
const bankRoute = require("./routes/bankRoute.js");
const customerRoute = require("./routes/customerRoute.js");
const transactionRoute = require("./routes/transactionRoute.js");
const employeeRoute = require("./routes/employeeRoute.js");
const adminRoute = require("./routes/adminRoute.js");

const app = express();

// ---------- Core Middlewares ----------
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

// ---------- CORS (allow credentials) ----------
app.use(cors({
  origin: "https://localhost:5173",
  credentials: true,
}));

// ---------- Helmet ----------
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));

// ---------- Security Middlewares ----------
securityMiddlewares(app);

// ---------- Logging & Sanitization ----------
app.use(morgan("dev"));
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  if (req.query) req.query = sanitize(req.query);
  next();
});
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// ---------- Rate Limiting ----------
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // 5 attempts per 10 minutes
  message: "Too many login attempts. Please try again in 10 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registrations per hour
  message: "Too many registration attempts from this IP. Try in an hour.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);
app.use("/v1/auth/login", loginLimiter);
app.use("/v1/auth/register", registerLimiter);
app.use("/v1/auth/staffLogin", loginLimiter);

app.use(cookieParser());
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

// Provide token for frontend
app.get("/csrf-token", csrfProtection, (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), { sameSite: "strict" });
  res.json({ csrfToken: req.csrfToken() });
});

// Apply CSRF only to unsafe methods globally
app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

app.use("/v1/auth", authRoute);
app.use("/v1/bank", bankRoute);
app.use("/v1/customer", customerRoute);
app.use("/v1/transaction", transactionRoute);
app.use("/v1/employee", employeeRoute);
app.use("/v1/admin", adminRoute);

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
