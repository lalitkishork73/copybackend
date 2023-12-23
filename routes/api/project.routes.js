const express = require("express");
const router = express.Router({ mergeParams: true });

const projectControllers = require("../../controllers/projects.controllers");
const { useTryCatch } = require("../../services/utility.service");

router.post("/getAllProjects", useTryCatch(projectControllers.getAllProjects));
router.post("/createProject", useTryCatch(projectControllers.createProject));
router.put("/editProject", useTryCatch(projectControllers.editProject));
router.get(
  "/getProjectById/:projectId",
  useTryCatch(projectControllers.getProjectById)
);
module.exports = router;
