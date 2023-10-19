const { STR_SOMETHING_WENT_WRONG } = require("../../utils/const");
const Group = require("../../models/group.model");
const User = require("../../models/users.model");

exports.createGroup = async (body) => {
  try {
    const { group_name, created_by, users } = body || {};
    const newGroup = new Group({
      group_name,
      created_by,
      users,
    });
    const response = await newGroup.save();
    if (!response) {
      return {
        success: false,
        message: "Error while creating group",
        data: null,
      };
    }
    users.map(async (item) => {
      await User.findByIdAndUpdate(item, { $push: { groups: response._id } });
    });
    return {
      success: true,
      message: "Group created succussfully",
      data: response,
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

exports.findGroupListByUser = async ({ _id }) => {
  try {
    const userid = _id;
    const response = await Group.find({
      users: { $in: userid },
      deletedAt: null,
    }).populate({ path: "users", populate: ["groups"] });
    if (!response) {
      return {
        success: false,
        message: "group not found",
        data: null,
      };
    }
    return {
      success: true,
      message: "Group list found",
      data: response,
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

exports.addMembersInGroup = async (_id, body) => {
  try {
    const { users } = body || {};
    users.map(async (item) => {
      await Group.findByIdAndUpdate(_id, { $push: { users: item } });
      await User.findByIdAndUpdate(item, { $push: { groups: _id } });
    });
    return {
      success: true,
      message: "Members added succussfully",
      data: null,
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
