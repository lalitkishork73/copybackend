const express = require("express");
const userControllers = require("../../controllers/users.controllers");
const { useTryCatch } = require("../../services/utility.service");

const router = express.Router({ mergeParams: true });

router.post("/getAllUsers", useTryCatch(userControllers.getAllUsers));
router.post("/getUserByEmail", useTryCatch(userControllers.findByEmail));
router.post("/registerUser", useTryCatch(userControllers.registerUser));
router.post("/loginUser", useTryCatch(userControllers.loginUser));
router.post("/setReview", useTryCatch(userControllers.setReview));
router.post("/getUserReviews", useTryCatch(userControllers.getUserReviews));
router.post("/readNotification", useTryCatch(userControllers.readNotification));
router.post("/setContacted", useTryCatch(userControllers.setContacted));
router.put("/updateUser", useTryCatch(userControllers.updateUser));
router.post(
  "/getCompaniesInFeed",
  useTryCatch(userControllers.getCompaniesInFeed)
);
module.exports = router;
