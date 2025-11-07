// server/routes/bankRoutes.js
const express = require('express');
const {
  getBanks,
  getBank,
  createBank,
  updateBank,
  deleteBank
} = require('../controllers/bankController.js');

const validateRequest = require('../middlewares/validateRequest');
const bankSchemas = require('../schemas/bankSchemas.js');
const { verifyToken } = require('../middlewares/authMiddleware.js');

const router = express.Router();

const requireEmployee = (req, res, next) => {
  if (req.user.userType !== 'employee') {
    return res.status(403).json({ message: 'Access denied: employees only' });
  }
  next();
};

router.get('/getBanks', verifyToken, getBanks);

router.get('/:id', verifyToken, getBank);

router.post(
  '/createBank',
  verifyToken,
  requireEmployee,
  validateRequest(bankSchemas.createBank),
  createBank
);

router.put(
  '/:id',
  verifyToken,
  requireEmployee,
  validateRequest(bankSchemas.updateBank),
  updateBank
);

router.delete('/:id', verifyToken, requireEmployee, deleteBank);

module.exports = router;
