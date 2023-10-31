const { commonResponse } = require("../../helpers");
const {
  STR_SOMETHING_WENT_WRONG,
  STR_INTERNAL_SERVER_ERROR,
} = require("../../utils/const");
const { deleteMessage, deleteMessageFromAll } = require("./message.service");
const { deleteMessageValidation } = require("./message.validator");

const router = require("express").Router();

router.delete("/:id", deleteMessageValidation, async (req, res) => {
  try {
    const { userDetails, params } = req || {};
    const { success, message, data } = await deleteMessage(
      params.id,
      userDetails
    );
    if (success) {
      return commonResponse.success(res, data, "MESSAGE_DELETED", message);
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

router.delete(
  "/delete-for-everyone/:id",
  deleteMessageValidation,
  async (req, res) => {
    try {
      const { userDetails, params } = req || {};
      const { success, message, data } = await deleteMessageFromAll(
        params.id,
        userDetails
      );
      if (success) {
        return commonResponse.success(res, data, "MESSAGE_DELETED", message);
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
  }
);
module.exports = router;
