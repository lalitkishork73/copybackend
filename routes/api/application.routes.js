const express = require("express");
const applicationController = require("../../controllers/application.controller");
const { useTryCatch } = require("../../services/utility.service");

const router = express.Router({ mergeParams: true });

router.post(
  "/getApplicationsByProjectId",
  useTryCatch(applicationController.getApplicationsByProjectId)
);

module.exports = router;
