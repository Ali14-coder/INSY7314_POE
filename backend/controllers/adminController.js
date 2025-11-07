// controllers/adminController.js
const Employee = require("../models/employeeModel.js");
const Admin = require("../models/adminModel.js");

// GET ALL EMPLOYEES
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, "-password"); // exclude passwords
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET method to view list of all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    // return the admins
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: get a singluar employee by id
const getEmployee = async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Employee ID required." });

  try {
    const employee = await Employee.findById(id, "-password");
    if (!employee)
      return res.status(404).json({ message: "Employee not found." });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE EMPLOYEE
const createEmployee = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        message: "Username, password, and role are required.",
      });
    }

    const existing = await Employee.findOne({ username });
    if (existing)
      return res.status(409).json({ message: "Username already exists." });

    if (role !== "employee") {
      return res.status(400).json({ message: "Invalid role. Only 'employee' allowed." });
    }

    const newEmployee = await Employee.create({ username, password, role });

    res.status(201).json({
      message: "Employee created successfully.",
      employee: {
        id: newEmployee._id,
        username: newEmployee.username,
        role: newEmployee.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT method to update an employee's account details
const updateEmployee = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
  new: true
}).select("-password");


    if (!updatedEmployee)
      return res.status(404).json({ message: "Employee not found." });

    res.status(202).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Employee not found." });

    res.status(202).json({
      message: "Employee deleted.",
      employee: deleted,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getEmployees, getEmployee, getAdmins, createEmployee, updateEmployee, deleteEmployee};
