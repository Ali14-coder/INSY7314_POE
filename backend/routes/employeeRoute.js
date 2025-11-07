// server/routes/employeeRoute.js
const express = require('express');
const {
  getPendingTransactions,
  getVerifiedTransactions,
  getOneTransaction,
  updateStatus
} = require('../controllers/employeeController.js');

const validateRequest = require('../middlewares/validateRequest');
const txSchemas = require('../schemas/employeeSchemas.js');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/getPendingTransactions', verifyToken, authorizeRole(['employee','admin']), getPendingTransactions);
router.get('/getVerifiedTransactions', verifyToken, authorizeRole(['employee','admin']), getVerifiedTransactions);

router.get('/:id', verifyToken, authorizeRole(['employee','admin']), validateRequest(txSchemas.getOneTransaction), getOneTransaction);

router.put(
  '/:id',
  verifyToken,
  authorizeRole(['employee']),
  validateRequest(txSchemas.updateStatus),
  updateStatus
);

module.exports = router;
