// controllers/customerController.js
const Employee = require("../models/employeeModel.js");
const Admin = require("../models/adminModel.js");

// GET method to view list of all employees and fields, except passwords
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    // return the employees
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
  // get the id of the employees that the user is looking for, from the parameters
  const id = req.params.id;

  // null check
  if (!id) {
    res.status(400).json({ message: "Please provide an ID to search for!" });
  }

  try {
    // try find the employees using the provided ID
    const employees = await Employee.findById(id);

    // if no employees is found matching the provided ID, we should return 404 with an informative message
    if (!employees) {
      res.status(404).json({ message: "No employees found that matches that ID." });
    }

    // otherwise, return the employees
    res.status(200).json(employees);
  } catch (error) {
    // throw a server error if an issue occurs
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
  // first we get the ID from the url
  const id = req.params.id;
  // then the updated information from the body
  const { username, password } = req.body;

  try {
    // firstly find the employee we need to update
    const employee = await Employee.findById(id);

    // if no employee, inform the user and don't proceed any further
    if (!employee) {
      res.status(404).json({ message: "No employee found that matches that ID." });
    }
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { username, password },
      { new: true }
    );
   
    res.status(202).json(employee);
  } catch (error) {
    // if things go south, spit out the error message
    res.status(500).json({ error: error.message });
  }
};

// DELETE method to remove an employee
const deleteEmployee = async (req, res) => {
  // get the id of the employee we want to remove
  const id = req.params.id;

  // null check
  if (!id) {
    res.status(400).json({ message: "Please provide an ID to delete." });
  }

  // first try find the employee
  try {
    var employee = await Employee.findById(id);

    // if no employee, 404 and exit the method
    if (!employee) {
      res.status(404).json({ message: "No employee found that matches that ID." });
    }

    // find the employee, delete it, and return what it was
    employee = await Employee.findByIdAndDelete(id);
    res.status(202).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getEmployees, getEmployee, getAdmins, createEmployee, updateEmployee, deleteEmployee};