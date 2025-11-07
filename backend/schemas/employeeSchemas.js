// schemas/employeeSchema.js
const Joi = require("joi");

// Secure username & password regex patterns
const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/; 
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
// Requires uppercase, lowercase, number, special char, min 8 chars

// Create Employee Schema
const createEmployee = Joi.object({
  username: Joi.string().pattern(usernameRegex).required().messages({
    "string.empty": "Username is required",
    "string.pattern.base": "Username must be 3–30 chars, alphanumeric, . _ - allowed",
  }),

  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must be 8+ chars, include uppercase, lowercase, number, special character",
  }),

  // Employees SHOULD NOT be able to set their own roles
  role: Joi.forbidden().messages({
    "any.unknown": "Role cannot be set manually.",
  }),
});

// Update Employee Schema
const updateEmployee = Joi.object({
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

// Get Employee Schema
const getEmployee = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.length": "Employee ID must be a valid 24-character ObjectId",
  }),
});

module.exports = {
  createEmployee,
  updateEmployee,
  getEmployee,
};