const jwt = require("jsonwebtoken");

const { noAuth, generalError } = require("../constants/general");

const BabyMonitor = require("../database/model/BabyMonitor");
const { GroceryError, BabyMonitorError } = require("./errorHandler");

const adminAuth = async (req, res, next) => {
  try {
    const { adminPassword } = req.body;
    if (!adminPassword) return next(new GroceryError(generalError, 404));
    if (adminPassword !== process.env.ADMIN_PASSWORD) return next(new GroceryError(noAuth, 403));
    next();
  } catch (e) {
    next(e);
  }
};

const babyMonitorAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const decoded = jwt.verify(token, process.env.SECRET);

    const babyMonitor = await BabyMonitor.findOne({ motherName: decoded.motherName });
    if (!babyMonitor) return next(new BabyMonitorError(noAuth, 403));

    req.babyMonitor = babyMonitor;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { adminAuth, babyMonitorAuth };
