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

const createTransaction = async (req, res) => {
  try {
    const { amount, description, type } = req.body;

    // The authenticated user (customer)
    const customerId = req.user.id; // assuming you attach this in your auth middleware

    const newTransaction = await Transaction.create({
      customerId, // ✅ required by schema
      amount,
      description,
      type,
      date: new Date(),
    });

    return res.status(201).json({
      message: "Transaction created successfully.",
      transaction: newTransaction,
    });
  } catch (err) {
    console.error("Create Transaction Error:", err);
    return res.status(500).json({
      message: "An error occurred while creating the transaction.",
      error: err.message,
    });
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
