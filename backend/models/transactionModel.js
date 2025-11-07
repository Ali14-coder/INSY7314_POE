// server/models/transactionModel.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, default: () => crypto.randomUUID() },
  status: { type: String, default: 'pending', required: true },
  customerId: { type: String, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  recipientReference: { type: String, required: false },
  customerReference: { type: String, required: false },
  swiftCode: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TransactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
