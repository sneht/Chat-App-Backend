const User = require("../../models/users.model");
const UserMeta = require("../../models/usermeta.model");
const bcrypt = require("bcryptjs");

exports.createUser = async (body) => {
  try {
    const { fullname, email, password } = body || {};
    const isUserExist = await User.findOne({ email, deletedAt: null });
    if (!isUserExist) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(String(password), salt);
      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
      });
      const response = await newUser.save();
      if (!response) {
        return {
          success: false,
          message: "Error while creating user",
          data: null,
        };
      }
      const newUserMeta = await UserMeta.create({
        user_id: response._id,
      });
      return {
        success: true,
        message: "Registration successfully",
        data: response,
      };
    }
    return {
      success: false,
      message: "User already exist",
      data: null,
    };
  } catch (err) {
    const { message = STR_SOMETHING_WENT_WRONG } = err || {};
    return {
      success: false,
      message,
      data: null,
    };
  }
};

exports.findAllUserList = async () => {
  try {
    const response = await User.find({ deletedAt: null }).populate({
      path: "groups",
      populate: ["users"],
    });
    if (!response) {
      return {
        success: false,
        message: "error while fetching user list",
        data: null,
      };
    }
    return {
      success: true,
      message: "User list found succussfully",
      data: response,
    };
  } catch (err) {
    const { message = STR_SOMETHING_WENT_WRONG } = err || {};
    return {
      success: false,
      message,
      data: null,
    };
  }
};

exports.findUserListForAddInExistGroup = async (_id) => {
  try {
    const response = await User.find({ groups: { $nin: _id } });
    return {
      success: true,
      message: "User List found",
      data: response,
    };
  } catch (err) {
    const { message = STR_SOMETHING_WENT_WRONG } = err || {};
    return {
      success: false,
      message,
      data: null,
    };
  }
};
