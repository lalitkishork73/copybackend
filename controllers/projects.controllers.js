const { Project } = require("../models");
const {
  createProjectService,
  getAllProjectsService,
  editProjectService,
  getProjectByIdService,
  getValidProjects,
} = require("../services/projects.service");
const { queryConditions } = require("../services/utility.service");

const getAllProjects = async (req, res) => {
  const { page = 1, size = 10 } = req.query;


  const conditions = queryConditions(req.body, Object.keys(Project.schema.obj));

  const response = await getAllProjectsService({ page, size, conditions });

  res.status(response.status).json({
    ...response,
  });
};

const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  console.log("project Id",projectId);   
  const response = await getProjectByIdService({
    projectId,
  });


  res.status(response.status).json({
    ...response,
  });
};

const createProject = async (req, res) => {
  const {
    projectTitle,
    description,
    skills,
    education,
    workLocation,
    softwareRequirements,
    freelancersCount,
    visibility,
    postedBy,
    budget,
    duration,
    category,
  } = req.body;

  console.log(skills);



  const response = await createProjectService({
    projectTitle,
    description,
    skills,
    education,
    workLocation,
    softwareRequirements,
    freelancersCount,
    visibility,
    postedBy,
    budget,
    duration,
    category,
  });

  res.status(response.status).json({
    ...response,
  });
};

const editProject = async (req, res) => {
  const {
    projectId,
    projectTitle,
    description,
    skills,
    education,
    workLocation,
    softwareRequirements,
    freelancersCount,
    visibility,
    postedBy,
    budget,
    duration,
  } = req.body;

  const response = await editProjectService({
    projectTitle,
    projectId,
    description,
    skills,
    education,
    workLocation,
    softwareRequirements,
    freelancersCount,
    visibility,
    postedBy,
    budget,
    duration,
  });

  res.status(response.status).json({
    ...response,
  });
};
const getValidProjectsForHire = async (req, res) => {
  const { freelancerId, clientId } = req.query;

  const response = await getValidProjects({
    freelancerId,
    clientId,
  });

  res.status(response.status).json({
    ...response,
  });
};

module.exports = {
  getAllProjects,
  createProject,
  editProject,
  getProjectById,
  getValidProjectsForHire,
};
