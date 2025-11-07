// server/schemas/authSchemas.js
module.exports = {
  registerSchema: {
    body: {
      username: "username",
      password: "password",
      firstName: "fullName",
      lastName: "fullName",
      nationalId: "nationalId",
      accountNumber: "accountNumber",
    },
  },

  loginSchema: {
  body: {
    userType: { pattern: /^(customer|employee|admin)$/, optional: false },
    username: "username",
    password: "password"
  }
},
};
