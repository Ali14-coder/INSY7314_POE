// server/routes/customers.js
const express = require('express');
const {
  updateCustomer,
  getCustomers,
  getCustomer,
  deleteCustomer
} = require('../controllers/customerController.js');

const validateRequest = require('../middlewares/validateRequest');
const customerSchemas = require('../schemas/customerSchemas.js');
const { verifyToken } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.put(
  '/:id',
  verifyToken,
  validateRequest(customerSchemas.updateCustomer),
  updateCustomer
);

router.get('/getCustomers', verifyToken, getCustomers);

router.get(
  '/:id',
  verifyToken,
  validateRequest(customerSchemas.getCustomer),
  getCustomer
);

router.delete(
  '/:id',
  verifyToken,
  validateRequest(customerSchemas.deleteCustomer),
  deleteCustomer
);
module.exports = router;
