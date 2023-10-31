const userController = require("../api/user/user.controller");
const loginController = require("../api/login/login.controller");
const groupController = require("../api/group/group.controller");
const messageController = require("../api/message/message.controller");
const { isAuthorized } = require("../helpers/gaurds");

const initialize = (app) => {
  app.use("/user", userController);
  app.use("/login", loginController);
  app.use("/group", isAuthorized, groupController);
  app.use("/message", isAuthorized, messageController);
};
module.exports = { initialize };
