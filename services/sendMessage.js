const messageModel = require("../models/messages.model");
const groupModel = require("../models/group.model");
exports.sendMessage = async ({ message, sent_by, room }) => {
  try {
    const { _id } = room || {};
    const body = new messageModel({ sent_by, message, group: _id });
    const response = await body.save();
    await groupModel.findByIdAndUpdate(_id, {
      $push: { messages: response._id },
    });
  } catch (err) {
    console.log("err", err);
  }
};
