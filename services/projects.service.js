const { User, Project } = require("../models");
const { pagination } = require("../services/utility.service");
const { userSelect, applicationSelect } = require("./service.constants");
const createProjectService = async (bodyArgs) => {
  const project = new Project({
    ...bodyArgs,
  });
  const err = await project.validateSync();
  if (err) {
    return {
      status: 400,
      message: "Something went wrong",
      err,
    };
  } else {
    const projectSave = await project.save();
    const userUpdate = await User.findOneAndUpdate(
      { _id: projectSave?.postedBy },
      { $push: { projects: projectSave?._id } },
      {
        runValidators: true,
        new: true,
      }
    );
    return {
      status: 200,
      message: "Project added",
      projectId: projectSave?._id,
      title: projectSave?.projectTitle,
      user: userUpdate?.userName,
    };
  }
};
const getAllProjectsService = async ({ page, size, conditions }) => {
  const { limit, skip } = pagination({ page, size });
  const count = await Project.find({ ...conditions }).count();
  const totalPages = count / size;
  const projects = await Project.find({ ...conditions }, {}, { limit, skip })
    .sort({ createdAt: -1 })
    .populate("postedBy")
    .populate({
      path: "appliedBy.userId",
      model: "user",
      select: userSelect,
    })
    .populate({
      path: "appliedBy.applicationId",
      model: "application",
      select: applicationSelect,
    })
    .populate({
      path: "postedBy",
      model: "user",
      select: userSelect,
    })
    .populate({
      path: "hireRequests.freelancerId",
      model: "user",
      select: userSelect,
    })
    .populate({
      path: "hireRequests.hireRequest",
      model: "hireRequest",
    })
    .populate({
      path: "hired.freelancerId",
      model: "user",
      select: userSelect,
    })
    .populate({
      path: "skills",
      model: "category",
    });
  if (projects.length >= 1) {
    const skills = projects.reduce(
      (a, c) => [...new Set([...a, ...c.skills])],
      []
    );
    const education = projects.reduce(
      (a, c) => [...new Set([...a, ...c.education])],
      []
    );
    const visibility = projects.reduce(
      (a, c) => [...new Set([...a, ...c.visibility])],
      []
    );
    return {
      status: 200,
      message: "Projects List",
      projects,
      totalPages,
      page,
      filter: {
        skills,
        education,
        visibility,
      },
    };
  } else {
    return {
      status: 400,
      message: "Bad Request",
    };
  }
};
const getProjectByIdService = async ({ projectId }) => {
  const project = await Project.findById(projectId).populate("skills");
  if (!project) {
    return { status: 404, message: "No project found" };
  } else {
    return {
      status: 200,
      message: "fetched project successfully",
      project,
    };
  }
};
const editProjectService = async ({
  projectTitle,
  description,
  projectId,
  skills,
  education,
  workLocation,
  softwareRequirements,
  freelancersCount,
  visibility,
  postedBy,
  budget,
  duration,
}) => {
  const project = await Project.findByIdAndUpdate(projectId, {
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
  });
  if (project) {
    return {
      status: 200,
      message: "Project updated successfully",
    };
  } else {
    return {
      status: 400,
      message: "Something went wrong",
    };
  }
};
const getProjectById = async ({ projectId }) => {
  const project = await Project.findById(projectId);
  if (!project) {
    return {
      status: 404,
      message: "Project not found",
    };
  } else {
    return {
      status: 200,
      message: "Project found",
      project,
    };
  }
};
const getValidProjects = async ({ clientId, freelancerId }) => {
  const projects = await Project.find({
    postedBy: clientId,
    $nor: [
      { "hireRequests.freelancerId": freelancerId },
      { "hired.freelancerId": freelancerId },
    ],
  }).exec();
  return { status: 200, message: "Get data", projects };
};
module.exports = {
  createProjectService,
  getAllProjectsService,
  editProjectService,
  getProjectById,
  getProjectByIdService,
  getValidProjects,
};
