// schemas/adminSchema.js
const Joi = require("joi");

const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Create Admin Schema
const createAdmin = Joi.object({
  username: Joi.string().pattern(usernameRegex).required().messages({
    "string.empty": "Username is required",
    "string.pattern.base":
      "Username must be 3–30 chars, alphanumeric, . _ - allowed",
  }),

  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must be 8+ chars, include uppercase, lowercase, number, special character",
  }),

  // Admins cannot set role manually
  role: Joi.forbidden().messages({
    "any.unknown": "Role cannot be set manually.",
  }),
});

// Update Admin Schema
const updateAdmin = Joi.object({
  username: Joi.string().pattern(usernameRegex).optional().messages({
    "string.pattern.base":
      "Username must be 3–30 chars, alphanumeric, . _ - allowed",
  }),

  password: Joi.string().pattern(passwordRegex).optional().messages({
    "string.pattern.base":
      "Password must be 8+ chars, include uppercase, lowercase, number, special character",
  }),

  role: Joi.forbidden().messages({
    "any.unknown": "Role cannot be modified.",
  }),
});

const getAdmin = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.length": "Admin ID must be a valid 24-character ObjectId",
  }),
});

module.exports = {
  createAdmin,
  updateAdmin,
  getAdmin,
};