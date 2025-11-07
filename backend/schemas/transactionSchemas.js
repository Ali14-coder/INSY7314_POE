// server/schemas/transactionSchemas.js
module.exports = {
  createTransaction: {
    body: {
      customerId: { pattern: 'objectId', optional: true },
      amount: 'amount',
      recipientReference: { pattern: /^[\w\s\.\-]{1,80}$/, optional: true }, // simple safe pattern
      customerReference: { pattern: /^[\w\s\.\-]{1,80}$/, optional: true },
      swiftCode: { pattern: 'swift', optional: false },
      status: { pattern: /^(pending|completed|failed|false)$/, optional: true }
    }
  },

  updateStatus: {
    params: { id: 'objectId' },
    body: { status: 'status' }
  },

  getTransaction: {
    params: { id: 'objectId' }
  }
};
