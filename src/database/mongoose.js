const mongoose = require("mongoose");

const groceriesDB = mongoose.createConnection(process.env.DB_KEY_GROCERIES);
const babyMonitorDB = mongoose.createConnection(process.env.DB_KEY_BABY_MONITOR);

module.exports = { groceriesDB, babyMonitorDB };
