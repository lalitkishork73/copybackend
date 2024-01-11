const { HireRequest, User } = require("../models");
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

const calculateProfileCompletion = async (email) => {
  const requiredFields = [
    "companyName",
    "intro",
    // "profilePic",
    "phoneNumber",
    "address",
    "socialProfiles",
    "skills",
    "website",
  ];

  let completedFields = 0;
  const user = await User.findOne({ email });

  // Check if the required fields are present and not empty
  requiredFields.forEach((field) => {
    if (user[field]) {
      if (
        Array.isArray(user[field]) &&
        user[field].length > 0 &&
        !user.skills
      ) {
        // If it's an array (e.g., socialProfiles, qualifications, skills), check if it has items
        completedFields += user[field].length;
      } else if (typeof user[field] === "string" && user[field].trim() !== "") {
        // If it's a string, check if it's not an empty string after trimming
        completedFields += 1;
      } else if (user.skills.length > 0) {
        completedFields += 1;
      }
    }
  });
  const totalFields = requiredFields.length; //2 for social profiles;
  const profileCompletionPercentage = (
    (completedFields / totalFields) *
    100
  ).toFixed(2);

  // Calculate the percentage
  await User.findByIdAndUpdate(user._id, {
    profileCompleted: profileCompletionPercentage,
  });

  // Return the percentage with 2 decimal places
};

const useTryCatch = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));

module.exports = {
  pagination,
  queryConditions,
  useTryCatch,
  comparePassword,
  hashPassword,
  calculateProfileCompletion,
};
