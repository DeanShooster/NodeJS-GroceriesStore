const { MIN_NAME_LENGTH, MAX_NAME_LENGTH } = require("../constants/general");

function nameLengthValidation(nameInput) {
  if (nameInput.length < MIN_NAME_LENGTH || nameInput.length > MAX_NAME_LENGTH) return false;
  return true;
}

function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

module.exports = { nameLengthValidation, isNumber };
