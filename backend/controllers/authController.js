const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModel.js");
const Employee = require("../models/employeeModel.js");
const Admin = require("../models/adminModel.js");
const { invalidateToken } = require("../middlewares/authMiddleware.js");
require("dotenv").config();

// Helper: generate JWT with username, userType, and customerId
const generateJwt = (username, userType, customerId) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not found in .env");
    throw new Error("JWT_SECRET not defined");
  }
  return jwt.sign({ username, userType, customerId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// POST: Register endpoint
const staffRegister = async (req, res) => {
  const { userType, username, password } = req.body;

  console.log("Register request body:", req.body);

  try {
    if (!userType || !username || !password) {
      return res.status(400).json({
        message: "Missing required fields. Please ensure all fields are provided: Username, Account Number, Password, Last name, First name, National Id.",
      });
    }

    const UserModel = userType === "admin" ? Admin : Employee;

    // Check if username exists
    const exists = await UserModel.findOne({ username });
    if (exists) {
      console.warn(`⚠️ Username '${username}' already exists for ${userType}.`);
      return res.status(400).json({
        message: `The username '${username}' is already taken. Please choose a different one.`,
      });
    }

    // Validate password
    if (!password || password.length < 8) {
      console.warn("⚠️ Weak password detected.");
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // Create user
    const user = await UserModel.create({
      userType,
      username,
      password
    });

    console.log(` ${userType} registered successfully: ${username}`);

    // Generate JWT
    const token = generateJwt(username, userType, user._id);

    res.status(201).json({
      message: `${userType} : '${username}' registered successfully.`,
      token,
    });
  } catch (err) {
    console.error(" Register error:", err);
    res.status(500).json({
      message: "An unexpected error occurred while registering the user.",
      details: err.message,
      hint: "Check your MongoDB connection and model validation rules.",
    });
  }
};


// POST: Register endpoint
const register = async (req, res) => {
  const { userType, username, accountNumber, password, lastName, firstName, nationalId } = req.body;

  console.log("Register request body:", req.body);

  try {
    if (!userType || !username || !accountNumber || !password || !lastName || !firstName || !nationalId) {
      return res.status(400).json({
        message: "Missing required fields. Please ensure all fields are provided: Username, Account Number, Password, Last name, First name, National Id.",
      });
    }

    const UserModel = userType === "customer" ? Customer : Employee;

    // Check if username exists
    const exists = await UserModel.findOne({ username });
    if (exists) {
      console.warn(`⚠️ Username '${username}' already exists for ${userType}.`);
      return res.status(400).json({
        message: `The username '${username}' is already taken. Please choose a different one.`,
      });
    }

    // Validate password
    if (!password || password.length < 8) {
      console.warn("⚠️ Weak password detected.");
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // Validate account number format
    if (isNaN(accountNumber)) {
      console.warn("⚠️ Invalid account number format.");
      return res.status(400).json({
        message: "Account number must be numeric.",
      });
    }

    // Create user
    const user = await UserModel.create({
      userType,
      username,
      password,
      accountNumber,
      lastName,
      firstName,
      nationalId,
    });

    console.log(`✅ ${userType} registered successfully: ${username}`);

    // Generate JWT
    const token = generateJwt(username, userType, user._id);

    res.status(201).json({
      message: `${userType} : '${username}' registered successfully.`,
      token,
    });
  } catch (err) {
    console.error(" Register error:", err);
    res.status(500).json({
      message: "An unexpected error occurred while registering the user.",
      details: err.message,
      hint: "Check your MongoDB connection and model validation rules.",
    });
  }
};

// LOGIN (CUSTOMERS, EMPLOYEES, ADMINS)
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Missing credentials." });

    // Try admin first
    let user =
      (await Admin.findOne({ username })) ||
      (await Employee.findOne({ username })) ||
      (await Customer.findOne({ username }));

    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials." });

    const token = generateJwt(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// POST: Login endpoint
const staffLogin = async (req, res) => {
  const { userType, username, password } = req.body;;

  console.log("Login request body:", req.body);

  try {
    const UserModel = userType === "admin" ? Admin : Employee;

    // Find user
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // Compare password using model method
    const matching = await user.comparePassword(password);
    console.log("Password matches?", matching);

    if (!matching) return res.status(400).json({ message: "Invalid credentials." });

    // Generate JWT
    const token = jwt.sign(
      { username, userType, adminId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: `${userType} logged in successfully`, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST: Test password against hash (optional endpoint)
const testPassword = async (req, res) => {
  const { plainPassword, hashedPassword } = req.body;

  if (!plainPassword || !hashedPassword) {
    return res.status(400).json({ message: "Both plainPassword and hashedPassword are required." });
  }

  try {
    const match = await require("bcryptjs").compare(plainPassword, hashedPassword);
    res.status(200).json({ match });
  } catch (err) {
    console.error("Test password error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET: Logout endpoint
const logout = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(400).json({ message: "No token provided." });

  invalidateToken(token);
  console.log("Token invalidated:", token);

  res.status(200).json({ message: "Logged out successfully." });
};

module.exports = { register, staffRegister, login, staffLogin, logout, testPassword };
