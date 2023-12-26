const { User } = require("../models");
const { setNotification } = require("./notification.service");
const {
  pagination,
  comparePassword,
  hashPassword,
} = require("./utility.service");

const {
  userSelect,
  applicationSelect,
  projectSelect,
} = require("./service.constants");

const userFindService = async (conditions) => {
  const user = await User.find({ ...conditions })
    .populate({
      path: "notifications",
      populate: {
        path: "triggeredBy",
        select: userSelect,
      },
    })
    .populate({
      path: "notifications",
      populate: {
        path: "notify",
        select: userSelect,
      },
      match: { isRead: false },
    })
    .populate({
      path: "contacted",
      select: userSelect,
    })
    .populate({
      path: "projects",
      select: projectSelect,
    })
    .populate({
      path: "applications.projectId",
      select: { ...projectSelect, hired: 1 },
      populate: {
        path: "hired.freelancerId",
        select: userSelect,
      },
    })
    .populate({
      path: "applications.applicationId",
      select: applicationSelect,
    })
    .populate({
      path: "hireRequests.projectId",
      select: projectSelect,
    })
    .populate({
      path: "hireRequests.clientId",
      select: userSelect,
    })
    .populate({
      path: "reviews.reviewedBy",
      select: userSelect,
    })
    .populate({
      path: "favUsers",
      select: userSelect,
    })
    .populate({
      path: "favProjects",
      select: userSelect,
    })
    .populate({
      path: "favByUsers",
      select: userSelect,
    });
  return user;
};

const getAllUsersService = async ({ conditions, page, size }) => {
  const { limit, skip } = pagination({ page, size });

  const users = await User.find({ ...conditions }, {}, { limit, skip })
    .sort({ createdAt: -1 })
    .populate({
      path: "notifications",
      populate: {
        path: "triggeredBy",
        select: userSelect,
      },
    })
    .populate({
      path: "notifications",
      populate: {
        path: "notify",
        select: userSelect,
      },

      match: { isRead: false },
    })
    .populate({
      path: "contacted",
      select: userSelect,
    })
    .populate({
      path: "projects",
      select: projectSelect,
    })
    .populate({
      path: "applications.projectId",
      select: { ...projectSelect, hired: 1 },
      populate: {
        path: "hired.freelancerId",
        select: userSelect,
      },
    })
    .populate({
      path: "applications.applicationId",
      select: applicationSelect,
    })
    .populate({
      path: "hireRequests.projectId",
      select: projectSelect,
    })
    .populate({
      path: "hireRequests.clientId",
      select: userSelect,
    })
    .populate({
      path: "reviews.reviewedBy",
      select: userSelect,
    })
    .populate({
      path: "favUsers",
      select: userSelect,
    })
    .populate({
      path: "favProjects",
      select: userSelect,
    })
    .populate({
      path: "favByUsers",
      select: userSelect,
    });

  const count = await User.find({ ...conditions }).count();
  const totalPages = count / size;

  if (users) {
    const skills = users
      .reduce((a, c) => [...new Set([...a, ...c.skills])], [])
      .reduce((a, c) => [...new Set([...a, c.name])], []);

    const userType = users.reduce(
      (a, c) => [...new Set([...a, c.userType])],
      []
    );

    return {
      message: "Users List",
      status: 200,
      users,
      page,
      size,
      totalPages,
      filter: {
        skills,
        // qualifications,
        userType,
      },
    };
  } else {
    return {
      message: "Bad Request",
      status: 400,
    };
  }
};

const registerUserService = async ({
  email,
  firstName,
  lastName,
  password,
  phoneNumber,
  userName,
  userType,
}) => {
  const user = await await User.findOne({
    $or: [{ email }, { userName }],
  });
  console.log(user);
  if (user) {
    if (user.userName === userName) {
      return {
        message: "User Already Exists with the same username",
        status: 403,
      };
    }
    if (user.email === email) {
      return {
        message: "User Already Exists with the same Email Id",
        status: 403,
      };
    }
  } else {
    //hashing

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      return { status: 400, message: "something went wrong" };
    }

    const fullName = firstName + " " + lastName;

    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      phoneNumber,
      userName,
      userType,
      fullName,
    });
    const err = await newUser.validateSync();
    if (err) {
      console.log(err);
      return {
        message: `Something went Wrong`,
        status: 400,
        err,
      };
    } else {
      const newUserSave = await newUser.save();
      return {
        message: "User Registered",
        userDetails: newUserSave,
        status: 200,
      };
    }
  }
};

const loginUserService = async ({
  email,

  password,
}) => {
  const user = await User.find({ email });

  if (user.length === 0) {
    return { status: 404, message: "User not found" };
  } else {
    const updatedUser = await userFindService({ email });

    //checking password
    const isMatch = await comparePassword(password, user[0].password);

    if (!isMatch) {
      return {
        status: 400,
        message: "Invalid credentials",
      };
    } else {
      return { status: 200, message: "Login succes", user: updatedUser };
    }
  }
};

const setReviewService = async ({
  userId,
  reviewedBy,
  title,
  description,
  rating,
}) => {
  const userUpdate = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        reviews: {
          reviewedBy,
          title,
          description,
          rating,
        },
      },
    },
    {
      runValidators: true,
      new: true,
    }
  );

  const reviewerUpdate = await User.findByIdAndUpdate(
    reviewedBy,
    {
      $push: {
        reviewed: userUpdate._id,
      },
    },
    {
      runValidators: true,
      new: true,
    }
  );

  const notification = await setNotification({
    triggeredBy: reviewedBy,
    notify: userId,
    notificationMessage: "Got a Review",
    notificationType: "review",
  });

  const user = await User.find({ _id: userUpdate?._id });

  return {
    reviewedBy: reviewerUpdate?.email,
    user,
    notification,
    status: 200,
  };
};

const getUserReviewsService = async ({ userId }) => {
  const userReviews = await User.findById(userId, {
    email: 1,
    reviews: 1,
  }).populate({
    path: "reviews.reviewedBy",
    model: "user",
    select: {
      _id: 1,
      userName: 1,
      reviewed: 1,
    },
  });

  return {
    reviews: userReviews,
    userId: userReviews?._id,
  };
};

const setContactedService = async ({ senderUserId, receiverUserId }) => {
  const senderUserUpdate = await User.findOneAndUpdate(
    { _id: senderUserId },
    {
      $addToSet: {
        contacted: receiverUserId,
      },
    },
    {
      runValidators: true,
      new: true,
    }
  );

  const receiverUserUpdate = await User.findOneAndUpdate(
    { _id: receiverUserId },
    {
      $addToSet: {
        contacted: senderUserId,
      },
    },
    {
      runValidators: true,
      new: true,
    }
  );

  return {
    status: 200,
    message: "Contacted user added to set",
    senderUser: senderUserUpdate?._id,
    senderUserContacted: senderUserUpdate?.contacted,
    receiverUser: receiverUserUpdate?._id,
    receiverUserContacted: receiverUserUpdate?.contacted,
  };
};

const updateUserService = async ({
  firstName,
  lastName,
  email,
  userType,
  occupation,
  intro,
  profilePic,
  phoneNumber,
  address,
  socialProfiles,
  qualifications,
  skills,
  portfolioProjects,
  website,
}) => {
  const fullName = firstName + " " + lastName;
  console.log(socialProfiles);
  console.log(portfolioProjects);
  console.log(skills);

  const projects = portfolioProjects.filter((project) => project !== false);
  console.log(projects, "this is projects");
  if (!email) {
    return {
      status: 404,
      message: "Please provide valid email",
    };
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const userDetails = await User.findOneAndUpdate(
    { email: email },
    {
      fullName,
      firstName,
      lastName,
      email,
      userType,
      occupation,
      intro,
      profilePic,
      phoneNumber,
      address,
      socialProfiles,
      qualifications,
      skills,
      portfolioProjects: projects,
      website,
    }
  );

  return {
    status: 200,
    message: "User updated successfully",
    userDetails,
  };
};

module.exports = {
  userFindService,
  getAllUsersService,
  registerUserService,
  setReviewService,
  getUserReviewsService,
  setContactedService,
  loginUserService,
  updateUserService,
};
