const groupModel = require("../models/group.model");
exports.getAllMessages = async (room) => {
  try {
    const { _id } = room || {};
    const findMessageByGroup = await groupModel
      .findById({ _id })
      .populate("messages");
    const { messages } = findMessageByGroup || {};
    return JSON.stringify(messages);
  } catch (err) {
    console.log("err", err);
  }
};
