// models/employeeModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const EmployeeSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    default: () => crypto.randomUUID() 
  },

  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },

  password: { 
    type: String, 
    required: true 
  },

  //  Employees only have the "employee" role. This prevents privilege escalation.
  role: {
    type: String,
    enum: ["employee"],
    default: "employee",
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

//  Hash password before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//  Password comparison method
EmployeeSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Employee", EmployeeSchema);