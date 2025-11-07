// server/controllers/transactionController.js
const Transaction = require("../models/transactionModel.js");

// GET: all transactions (employee/admin only)
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: single transaction by transaction _id (owner or employee/admin)
const getTransaction = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Transaction ID is required." });

  try {
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: "Transaction not found." });

    if (req.user.role !== 'employee' && req.user.role !== 'admin' && req.user.id !== String(tx.customerId)) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json(tx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET transactions for a specific customer (customer own or employee/admin)
const getTransactionsByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    if (!customerId) return res.status(400).json({ message: "Customer ID is required." });

    if (req.user.role === 'customer' && req.user.id !== customerId) {
      return res.status(403).json({ message: "Access denied: cannot view other customer's transactions" });
    }

    const transactions = await Transaction.find({ customerId });
    res.status(200).json({ transactions });
  } catch (err) {
    console.error("Error fetching customer transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
};

// POST: create a transaction (customer only)
const createTransaction = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized — please log in first." });
    if (req.user.role !== 'customer') return res.status(403).json({ message: "Only customers can create transactions." });

    const { recipientReference, customerReference, amount, swiftCode, status } = req.body;
    if (!recipientReference || !customerReference || !amount || !swiftCode) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const transaction = await Transaction.create({
      customerId: req.user.customerId,
      amount: req.body.amount,
      recipientReference: req.body.recipientReference,
      customerReference: req.body.customerReference,
      swiftCode: req.body.swiftCode,
      status: req.body.status || "pending",
    });

    res.status(201).json({ message: "Transaction created successfully.", transaction });
  } catch (error) {
    console.error("Create Transaction Error:", error);
    res.status(500).json({ message: "An error occurred while creating the transaction.", error: error.message });
  }
};

// PUT: update transaction (employee only)
const updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status, recipientReference, customerReference, amount, customerId, swiftCode } = req.body;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: "No transaction found that matches that ID." });

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { status, recipientReference, customerReference, amount, customerId, swiftCode },
      { new: true }
    );

    res.status(202).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE: remove a transaction (employee only)
const deleteTransaction = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Please provide an ID to delete." });

  try {
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: "No transaction found that matches that ID." });

    const deleted = await Transaction.findByIdAndDelete(id);
    res.status(202).json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  getTransactionsByCustomer,
  createTransaction,
  updateStatus,
  deleteTransaction,
};
