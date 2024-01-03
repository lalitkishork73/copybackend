const { HireRequest } = require("../models");
var bcrypt = require("bcryptjs");

const pagination = ({ page, size }) => {
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  return { limit, skip };
};

const queryConditions = (bodyObj, keys = []) => {
  const conditions = {};

  for (let key of ["_id", ...keys]) {
    if (bodyObj[key]) conditions[key] = bodyObj[key];
  }

  return conditions;
};

const comparePassword = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  if (isMatch) {
    return true;
  } else {
    return false;
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    return false;
  }
};

const useTryCatch = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));

module.exports = {
  pagination,
  queryConditions,
  useTryCatch,
  comparePassword,
  hashPassword,
};
