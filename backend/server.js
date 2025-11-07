// server/server.js
const https = require("https");
const fs = require("fs");
const path = require("path");
const { connectToMongo } = require("./services/dbService.js");
const app = require("./app.js");

const PORT = process.env.API_PORT || 3000;

const options = {
  key: fs.readFileSync("./localhost+2-key.pem"),
  cert: fs.readFileSync("./localhost+2.pem"), 
};

connectToMongo()
  .then(() => {
    https.createServer(options, app).listen(PORT, () => {
      console.log(`Secure API running at https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

// Optional: handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});