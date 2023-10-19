const userController = require("../api/user/user.controller");
const loginController = require("../api/login/login.controller");
const groupConntroller = require("../api/group/group.controller");
const { isAuthorized } = require("../helpers/gaurds");

const initialize = (app) => {
  app.use("/user", userController);
  app.use("/login", loginController);
  app.use("/group", isAuthorized, groupConntroller);
};
module.exports = { initialize };
