const router = require("express").Router();
const { commonResponse } = require("../../helpers");
const {
  STR_SOMETHING_WENT_WRONG,
  STR_INTERNAL_SERVER_ERROR,
} = require("../../utils/const");
const {
  createGroup,
  findGroupListByUser,
  addMembersInGroup,
} = require("./group.service");

router.post("/", async (req, res) => {
  try {
    const { body, userDetails } = req || {};
    const { success, message, data } = await createGroup(body, userDetails);
    if (success) {
      return commonResponse.success(res, data, "GROUP_CREATED", message);
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

router.get("/", async (req, res) => {
  try {
    const { userDetails } = req || {};
    const { success, message, data } = await findGroupListByUser(userDetails);
    if (success) {
      return commonResponse.success(res, data, "GROUP_CREATED", message);
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

router.patch("/:id", async (req, res) => {
  try {
    const { params, body } = req || {};
    const { success, message, data } = await addMembersInGroup(params.id, body);
    if (success) {
      return commonResponse.success(res, data, "USER_ADDED", message);
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
