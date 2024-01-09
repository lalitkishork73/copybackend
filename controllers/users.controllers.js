const { User } = require("../models");
const { queryConditions } = require("../services/utility.service");
const { readNotificationService } = require("../services/notification.service");
const {
  getUserReviewsService,
  setReviewService,
  userFindService,
  getAllUsersService,

  registerUserService,
  setContactedService,
  loginUserService,
  updateUserService,
  getCompaniesInFeedService,
} = require("../services/users.service");

const getAllUsers = async (req, res) => {
  const { page = 1, size = 10 } = req.query;

  const conditions = queryConditions(req.body, Object.keys(User.schema.obj));

  const response = await getAllUsersService({
    conditions,
    page,
    size,
  });

  return res.status(response?.status).json({
    ...response,
  });
};
const registerUser = async (req, res) => {
  const {
    email,
    companyName,
    password,
    phoneNumber,
    userName,

    firstName,
    lastName,

    userType,
  } = req.body;

  const response = await registerUserService({
    email,
    companyName,
    password,
    phoneNumber,
    userName,

    firstName,
    lastName,

    userType,
  });

  res.status(response?.status).json({
    ...response,
  });
};

const updateUser = async (req, res) => {
  const {
    // firstName,
    // lastName,
    companyName,
    email,
    // userType,
    // occupation,
    intro,
    profilePic,
    phoneNumber,
    address,
    socialProfiles,
    qualifications,
    skills,
    // portfolioProjects,
    website,
  } = req.body;
  const response = await updateUserService({
    companyName,
    // firstName,
    // lastName,
    email,
    // userType,
    // occupation,
    intro,
    profilePic,
    phoneNumber,
    address,
    socialProfiles,
    qualifications,
    skills,
    // portfolioProjects,
    website,
  });
  res.status(response?.status).json({
    ...response,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  const response = await loginUserService({
    email,
    password,
  });
  res.status(response?.status).json({
    ...response,
  });
};

const findByEmail = async (req, res) => {
  const { email } = req.body;

  const user = await userFindService({
    email,
  });

  if (user.length) {
    res.status(200).json({
      message: "User Found",
      user,
    });
  } else {
    res.status(400).json({
      message: "Bad Request",
    });
  }
};

const setReview = async (req, res) => {
  const { userId, reviewedBy, title, description, rating } = req.body;

  const response = await setReviewService({
    userId,
    reviewedBy,
    title,
    description,
    rating,
  });

  res.status(response?.status).json({
    ...response,
    title,
    description,
    rating,
  });
};

const getUserReviews = async (req, res) => {
  const { reviews, userId } = await getUserReviewsService({
    userId: req.body.userId,
  });

  res.status(200).json({
    message: "Reviews of User",
    reviews,
    userId,
  });
};

const readNotification = async (req, res) => {
  const { notificationId, userId } = req.body;

  const notification = await readNotificationService({
    notificationId,
    userId,
  });

  res.status(200).json({
    message: "Notification read success",
    notificationId: notification._id,
    userId: notification.notify,
  });
};

const setContacted = async (req, res) => {
  const { senderUserId, receiverUserId } = req.body;

  const response = await setContactedService({
    senderUserId,
    receiverUserId,
  });

  res.status(response.status).json({
    ...response,
  });
};

const getCompaniesInFeed = async (req, res) => {
  const { companyId } = req.body;

  const response = await getCompaniesInFeedService(companyId);
  res.status(response.status).json({
    ...response,
  });
};

module.exports = {
  getAllUsers,
  registerUser,
  findByEmail,
  setReview,
  getUserReviews,
  readNotification,
  setContacted,
  loginUser,
  updateUser,
  getCompaniesInFeed,
};
