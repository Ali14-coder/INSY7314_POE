const express = require('express');
const { register, staffRegister, login, staffLogin, logout, testPassword } = require('../controllers/authController.js');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const registerSchema = {
  body: {
    userType: /^(customer|employee)$/,
    username: 'username',
    password: 'password',
    firstName: 'fullName',
    lastName: 'fullName',
    nationalId: 'nationalId'
  }
};  

// Schema for staff register
const staffRegisterSchema = {
  body: {
    userType: /^(admin|employee)$/,
    username: 'username',
    password: 'password'
  }
};  

//Schema for login
const loginSchema = {
  body: {
    userType: { type: 'string', pattern: /^(customer)$/ },
    username: 'username',
    password: 'password',
    accountNumber: { type: 'string', optional: true }
  }
};


// Schema for login
const staffLoginSchema = {
  body: {
    userType: /^(employee|admin)$/,
    username: 'username',
    password: 'password'
  }
};

router.post('/register', validateRequest(registerSchema), register);
router.post('/staffRegister', validateRequest(staffRegisterSchema), staffRegister);
router.post('/login', validateRequest(loginSchema), login);
router.post('/staffLogin', validateRequest(staffLoginSchema), staffLogin);
router.post('/test-password', testPassword);
router.get('/logout', logout);

module.exports = router;