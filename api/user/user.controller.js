const { commonResponse } = require("../../helpers");
const { isAuthorized } = require("../../helpers/gaurds");
const {
  STR_USER_CREATED_CAP,
  STR_USER_ADDED_SUCCESSFULLY,
  STR_ALREADY_EXISTS_CAP,
  STR_SOMETHING_WENT_WRONG,
  STR_INTERNAL_SERVER_ERROR,
} = require("../../utils/const");
const {
  createUser,
  findAllUserList,
  findUserListForAddInExistGroup,
} = require("./user.service");
const { createUserValidation } = require("./user.validator");
const router = require("express").Router();

// Create User
router.post("/", createUserValidation, async (req, res) => {
  try {
    const { body } = req || {};
    const { success, message, data } = await createUser(body);
    if (success) {
      return commonResponse.success(
        res,
        data,
        STR_USER_CREATED_CAP,
        STR_USER_ADDED_SUCCESSFULLY
      );
    } else if (message === STR_ALREADY_EXISTS_CAP) {
      return commonResponse.keyAlreadyExist(
        res,
        message,
        req.languageCode,
        400
      );
    } else {
      return commonResponse.failure(res, message);
    }
  } catch (err) {
    const { message = STR_SOMETHING_WENT_WRONG } = err || {};
    return commonResponse.sendUnexpected(
      res,
      null,
      STR_INTERNAL_SERVER_ERROR,
      message
    );
  }
});

router.get("/", isAuthorized, async (req, res) => {
  try {
    const { userDetails } = req || {};
    const { success, message, data } = await findAllUserList(userDetails);
    if (success) {
      return commonResponse.success(res, data, "USERS_LIST", message);
    } else {
      return commonResponse.failure(res, message);
    }
  } catch (err) {
    const { message = STR_SOMETHING_WENT_WRONG } = err || {};
    return commonResponse.sendUnexpected(
      res,
      null,
      STR_INTERNAL_SERVER_ERROR,
      message
    );
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { params } = req || {};
    const { success, message, data } = await findUserListForAddInExistGroup(
      params.id
    );
    if (success) {
      return commonResponse.success(res, data, "USERS_LIST", message);
    } else {
      return commonResponse.failure(res, message);
    }
  } catch (err) {
    const { message = STR_SOMETHING_WENT_WRONG } = err || {};
    return commonResponse.sendUnexpected(
      res,
      null,
      STR_INTERNAL_SERVER_ERROR,
      message
    );
  }
});
module.exports = router;
