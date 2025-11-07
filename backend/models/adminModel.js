// models/adminModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const AdminSchema = new mongoose.Schema({
  adminId: { 
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

  //  Admins only have the admin role
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

//  Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//  Password comparison method
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
