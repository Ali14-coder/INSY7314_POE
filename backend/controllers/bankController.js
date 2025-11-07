// controllers/bankController.js
const Bank = require('../models/bankModel.js');
const { create } = require('../models/customerModel.js');

// GET: all banks
const getBanks = async (req, res) => {
  try {
    const banks = await Bank.find({});
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: a single bank
const getBank = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ message: "Please provide an ID to search for!" });
  }

  try {
    const bank = await Bank.findById(id);

    if (!bank) {
      res.status(404).json({ message: "No bank found that matches that ID." });
    }

    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST: create a bank
const createBank = async (req, res) => {
  const { bankName, swiftCode} = req.body;

  if (!bankName || !swiftCode) {
    res
      .status(400)
      .json({ message: "Please ensure that all fields are provided for the bank." });
  }

  try {
    const bank = await Bank.create({ bankName, swiftCode});
    res.status(201).json(bank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT: update an existing bank
const updateBank = async (req, res) => {
  const id = req.params.id;
  const {  bankName, swiftCode } = req.body;

  try {
    const bank = await Bank.findById(id);

    if (!bank) {
      res.status(404).json({ message: "No bank found that matches that ID." });
    }

    const updatedBank = await Bank.findByIdAndUpdate(
      id,
      {  bankName, swiftCode  },
      { new: true }
    );
    res.status(202).json(updatedBank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE: nuke a bank from existence
const deleteBank = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ message: "Please provide an ID to delete." });
  }

  try {
    var bank = await Bank.findById(id);

    if (!bank) {
      res.status(404).json({ message: "No bank found that matches that ID." });
    }

    bank = await Bank.findByIdAndDelete(id);
    res.status(202).json(bank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBanks,
  getBank,
  createBank,
  updateBank,
  deleteBank,
};