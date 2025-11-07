// dbService.js
const mongoose = require('mongoose');
require('dotenv').config()

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.CONN_STRING);
        console.log("Connected to mongo database successfully.")
    } catch (err) {
        console.error("Unable to connect to the mongo database:", err.message)
        process.exit(1);
    }
}

module.exports = {connectToMongo}