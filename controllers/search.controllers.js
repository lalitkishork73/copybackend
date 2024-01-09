const { searchService } = require("../services/search.service");

const search = async (req, res) => {
    const { page = 1, size = 10, userType } = req.query;
    const {
        searchString,
        budgetMin,
        budgetMax,
        skills,
        location,
        duration,
        address,
        qualification,
        isRemote,
    } = req.body;
    const response = await searchService({
        searchString,
        budgetMin,
        budgetMax,
        skills,
        location,
        isRemote,
        duration,
        address,
        qualification,
        page,
        size,
        userType
    })

    res.status(response.status).json({
        ...response
    })
}

module.exports = {
    search
}
