// server/routes/adminRoute.js
const express = require('express');
const {
  getEmployees, getEmployee, getAdmins, createEmployee, updateEmployee, deleteEmployee
} = require('../controllers/adminController.js');

const validateRequest = require('../middlewares/validateRequest');
const employeeSchemas = require('../schemas/employeeSchema.js'); 
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// GET all admins
router.get('/getAdmins', verifyToken, getAdmins);

// GET all employees
router.get('/getEmployees', verifyToken, getEmployees);

router.post(
  '/createEmployee',
  verifyToken,
  authorizeRole(['admin']),
  validateRequest(employeeSchemas.createEmployee),
  createEmployee
);

router.put(
  '/:id',
  verifyToken,
  authorizeRole(['admin']),
  validateRequest(employeeSchemas.updateEmployee),
  updateEmployee
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['admin']),
  validateRequest(employeeSchemas.getEmployee),
  deleteEmployee
);

module.exports = router;
