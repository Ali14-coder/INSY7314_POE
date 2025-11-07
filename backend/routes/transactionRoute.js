// server/routes/transactionRoute.js
const express = require('express');
const {
  getTransaction,
  getTransactions,
  getTransactionsByCustomer,
  createTransaction,
  updateStatus,
  deleteTransaction
} = require('../controllers/transactionController.js');

const validateRequest = require('../middlewares/validateRequest');
const txSchemas = require('../schemas/transactionSchemas.js');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/getTransactions', verifyToken, authorizeRole(['employee','admin']), getTransactions);

router.get(
  '/customer/:customerId',
  verifyToken,
  authorizeRole(['customer','employee','admin']),
  getTransactionsByCustomer
);

router.get('/:id', verifyToken, validateRequest(txSchemas.getTransaction), getTransaction);

router.post(
  '/createTransaction',
  verifyToken,
  authorizeRole(['customer']),
  validateRequest(txSchemas.createTransaction),
  createTransaction
);

router.put(
  '/:id',
  verifyToken,
  authorizeRole(['employee']),
  validateRequest(txSchemas.updateStatus),
  updateStatus
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['employee']),
  validateRequest(txSchemas.getTransaction),
  deleteTransaction
);

module.exports = router;
