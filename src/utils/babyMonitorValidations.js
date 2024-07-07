const { isNumber } = require("./validation");
const { MAX_BABY_WEIGHT, MIN_BABY_WEIGHT, MIN_BABY_HEIGHT, MAX_BABY_HEIGHT, MAX_BABY_AGE } = require("../constants/general");

function isValidWeight(weight) {
  if (isNumber(weight) && weight > MIN_BABY_WEIGHT && weight <= MAX_BABY_WEIGHT) return true;
  return false;
}

function isValidHeight(height) {
  if (isNumber(height) && height > MIN_BABY_HEIGHT && height <= MAX_BABY_HEIGHT) return true;
  return false;
}

function isValidAge(birthDate) {
  if (!birthDate) return false;
  const today = new Date();
  const babyBirthDate = new Date(birthDate);

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const birthYear = babyBirthDate.getFullYear();
  const birthMonth = babyBirthDate.getMonth();
  const birthDay = babyBirthDate.getDate();

  let age = todayYear - birthYear;
  if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) age--;
  return age >= 0 && age <= MAX_BABY_AGE;
}

module.exports = { isValidWeight, isValidHeight, isValidAge };
