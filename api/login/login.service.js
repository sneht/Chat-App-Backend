const User = require("../../models/users.model");
const UserMeta = require("../../models/usermeta.model");
const { createToken } = require("../../helpers/gaurds");
const bcrypt = require("bcryptjs");
const {
  STR_LOGIN_SUCCESSFULLY,
  STR_SOMETHING_WENT_WRONG,
} = require("../../utils/const");

exports.login = async (body) => {
  try {
    const { email, password } = body || {};
    const findUserExistOrNot = await User.findOne({
      email,
      deletedAt: null,
    }).populate("groups");
    if (!findUserExistOrNot) {
      return {
        success: false,
        message: "User doesn't exist",
        data: null,
      };
    }
    const validated = await bcrypt.compare(
      password,
      findUserExistOrNot.password
    );
    if (!validated) {
      return {
        success: false,
        message: "Password doesn't match",
        data: null,
      };
    }
    const token = createToken(findUserExistOrNot);
    const isUpdated = await UserMeta.findOneAndUpdate(
      {
        user_id: findUserExistOrNot._id,
      },
      {
        token: token,
      }
    );
    return {
      success: true,
      message: STR_LOGIN_SUCCESSFULLY,
      data: { ...JSON.parse(JSON.stringify(findUserExistOrNot)), token },
    };
  } catch (err) {
    const { message = STR_SOMETHING_WENT_WRONG } = err || {};
    return {
      success: false,
      message: message,
      data: null,
    };
  }
};
