// controllers/customerController.js
const Customer = require("../models/customerModel.js");

// PUT: update an existing customer
const updateCustomer = async (req, res) => {
  const id = req.params.id;
  const { nationalId, firstName, lastName, username, password } = req.body;

  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      res.status(404).json({ message: "No customer found that matches that ID." });
    }
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { nationalId, firstName, lastName, username, password },
      { new: true }
    );
   
    res.status(202).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: get a singluar customers by id
const getCustomer = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ message: "Please provide an ID to search for!" });
  }

  try {
    const customers = await Customer.findById(id);

    if (!customers) {
      res.status(404).json({ message: "No customers found that matches that ID." });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE: remove a customer
const deleteCustomer = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ message: "Please provide an ID to delete." });
  }

  try {
    var customer = await Customer.findById(id);

    if (!customer) {
      res.status(404).json({ message: "No customer found that matches that ID." });
    }

    customer = await Customer.findByIdAndDelete(id);
    res.status(202).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {updateCustomer, getCustomers, getCustomer, deleteCustomer};