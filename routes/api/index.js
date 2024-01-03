const express = require("express");

const apiRouter = express.Router({ mergeParams: true });

const userRouter = require("./user.routes");
const projectsRouter = require("./project.routes");
const favoutiesRouter = require("./favourites.routes");
const hireRouter = require("./hire.routes");
const searchRouter = require("./search.routes");
const applicationRouter = require("./application.routes");
const messagesRouter = require("./message.routes");
const chatRouter = require("./chat.routes");
const categoryRouter = require("./category.routes");
apiRouter.use("/search", searchRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/favourites", favoutiesRouter);
apiRouter.use("/hire", hireRouter);
apiRouter.use("/application", applicationRouter);

apiRouter.use("/chat", chatRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use("/category", categoryRouter);
module.exports = apiRouter;
