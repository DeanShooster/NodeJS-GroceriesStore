const { serverError, noAuth } = require("../constants/general");

class GroceryError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BabyMonitorError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Generic error handler.
 * Error Object: {Message, Status}
 * @param {Error} error
 * @param {Request} req
 * @param {Result} res
 * @param {Callback} next
 */
const errorHandler = (error, req, res, next) => {
  let ErrorOb;
  if (error.constructor.name === "Error") ErrorOb = { Error: serverError, status: 500 };
  else if (error.message === "jwt malformed") ErrorOb = { Error: noAuth, status: 401 };
  else ErrorOb = { Error: error.message, status: error.status };
  return res.status(error.status || 500).send(ErrorOb);
};

module.exports = { errorHandler, GroceryError, BabyMonitorError };
