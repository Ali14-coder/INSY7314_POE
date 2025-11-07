//controllers/transactionController.js
const Transaction = require("../models/transactionModel.js");
const Employee = require("../models/employeeModel.js");

// GET method to view a list of all the pending transactions of all customers
const getPendingTransactions = async (req, res) => {
  try {
    // Find all transactions where status is "pending"
    const pendingTransactions = await Transaction.find({ status: 'pending' });

    // Return the transactions
    res.status(200).json(pendingTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET method to view all the previously approved or denied transactions made by customers
const getVerifiedTransactions = async (req, res) => {
  try {
    const verifiedTransactions = await Transaction.find({ status: { $in: ['approved', 'denied'] }});
    // return the verified transactions
    res.status(200).json(verifiedTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: get a singluar transaction by id
const getOneTransaction = async (req, res) => {
  // get the id of the transaction that the user is looking for, from the parameters
  const id = req.params.id;

  // null check
  if (!id) {
    res.status(400).json({ message: "Please provide an ID to search for!" });
  }

  try {
    // try find the transactions using the provided ID
    const transactions = await Transaction.findById(id);

    // if no transactions is found matching the provided ID, we should return 404 with an informative message
    if (!transactions) {
      res.status(404).json({ message: "No transactions found that matches that ID." });
    }

    // otherwise, return the transactions
    res.status(200).json(transactions);
  } catch (error) {
    // throw a server error if an issue occurs
    res.status(500).json({ error: error.message });
  }
};

// PUT method to update swift code status (approve or deny) of a particular customer
// PUT /v1/employee/:id - Update status
const updateStatus = async (req, res) => {
  const transactionId = req.params.id;
  const { status } = req.body;

  // Validate status
  if (!status || !["approved", "denied"].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'denied'." });
  }

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true } // return updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "No transaction found with that ID." });
    }

    res.status(200).json({
      message: `Transaction ${updatedTransaction.transactionId} updated to ${status}.`,
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPendingTransactions, getVerifiedTransactions, getOneTransaction, updateStatus};