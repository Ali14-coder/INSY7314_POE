const mongoose = require('mongoose');

const CustomerBankSchema = new mongoose.Schema({
  customerBankId: { type: String, default: () => crypto.randomUUID() },
  accountNumber: Number,
  //fk
  customerId: [{ type: String, ref: "customerModel" }],
  bankId: [{ type: String, ref: "bankModel" }]
});

const CustomerBank = mongoose.model('CustomerBank', CustomerBankSchema);

module.exports = CustomerBank;