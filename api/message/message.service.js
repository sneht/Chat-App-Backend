const messageModel = require("../../models/messages.model");
const { STR_SOMETHING_WENT_WRONG } = require("../../utils/const");

exports.deleteMessage = async (messageId, userId) => {
  try {
    const { _id } = userId || {};
    const { users = [] } = await messageModel.findOne({
      _id: messageId,
      deletedAt: null,
    });
    const _idString = _id.toString();
    const filterdUserList = users.filter((res) => {
      const resString = res.toString();
      return resString !== _idString;
    });

    const response = await messageModel
      .findOneAndUpdate({ _id: messageId }, { users: filterdUserList })
      .populate("group");
    return {
      success: true,
      message: "Message deleted succussfully",
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

exports.deleteMessageFromAll = async (messageId) => {
  try {
    const response = await messageModel
      .findOneAndUpdate({ _id: messageId }, { users: [] })
      .populate("group");
    return {
      success: true,
      message: "Message deleted succussfully",
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
