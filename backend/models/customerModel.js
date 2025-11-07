const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, default: () => crypto.randomUUID() },
  nationalId: String,
  firstName: String,
  lastName: String,
  username: String,
  accountNumber: Number,
  password: String,
  role: { type: String, default: 'customer' },
});

CustomerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

CustomerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
