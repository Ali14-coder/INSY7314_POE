// models/bankModel.js
const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
  bankId: { type: String, default: () => crypto.randomUUID() },
  bankName: String,
  swiftCode: String
});
const Bank = mongoose.model('Bank', BankSchema);

module.exports = Bank;