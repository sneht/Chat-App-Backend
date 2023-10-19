const { commonResponse } = require("../../helpers");
const {
  STR_LOGIN_SUCCESSFULLY_CAP,
  STR_INTERNAL_SERVER_ERROR,
  STR_SOMETHING_WENT_WRONG,
} = require("../../utils/const");
const { login } = require("./login.service");
const { loginUserValidation } = require("./login.validator");
const router = require("express").Router();

router.post("/", loginUserValidation, async (req, res) => {
  try {
    const { body } = req || {};
    const { success, message, data } = await login(body);
    if (success) {
      return commonResponse.success(
        res,
        data,
        STR_LOGIN_SUCCESSFULLY_CAP,
        message
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
module.exports = router;
