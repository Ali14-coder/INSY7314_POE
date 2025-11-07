// scripts/seedSuperAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/adminModel.js");

async function run() {
  if (!process.env.CONN_STRING) {
    console.error("CONN_STRING missing in .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.CONN_STRING);
  const username = process.env.SUPERADMIN_USERNAME || "superadmin";
  const password = process.env.SUPERADMIN_PASSWORD || "ChangeMe!123";

  const exists = await Admin.findOne({ username });
  if (exists) {
    console.log("Superadmin already exists:", username);
    process.exit(0);
  }

  const admin = new Admin({
    username,
    password,
    role: "admin",
  });

  await admin.save();
  console.log("Superadmin created:", username);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
