const joi = require("joi");
const { commonResponse } = require("../../helpers");
const {
  STR_REQUIRED_VALIDATION_CAP,
  STR_INTERNAL_SERVER_ERROR,
  STR_SOMETHING_WENT_WRONG,
} = require("../../utils/const");

exports.deleteMessageValidation = (req, res, next) => {
  try {
    const schema = joi.object({
      id: joi.string().required(),
    });
    let data = schema.validate(req.params);
    if (data.hasOwnProperty("error")) {
      return commonResponse.sendJoiError(
        res,
        STR_REQUIRED_VALIDATION_CAP,
        "",
        data.error
      );
    } else {
      next();
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
};
