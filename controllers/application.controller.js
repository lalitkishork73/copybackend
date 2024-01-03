const { Project } = require("../models");
const {
  getApplicationsByProjectIdService,
} = require("../services/applications.service");
const { queryConditions } = require("../services/utility.service");

const getApplicationsByProjectId = async (req, res) => {
  const { page = 1, size = 10 } = req.query;
  const {
    projectId,
    minBid = 0,
    maxBid = 10000,
    minRating = 0,
    maxRating = 5,
    sortedBy = "mostReviews",
  } = req.body;
  //   const conditions = queryConditions(req.body, Object.keys(Project.schema.obj));
  const filters = {
    projectId,

    bid: { $gte: minBid, $lte: maxBid },
  };
  console.log(projectId, "thisis project ");
  const response = await getApplicationsByProjectIdService({
    filters,
    sortedBy,
  });

  res.status(response.status).json({
    ...response,
  });
};

module.exports = {
  getApplicationsByProjectId,
};
