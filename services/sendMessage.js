const messageModel = require("../models/messages.model");
const groupModel = require("../models/group.model");

exports.sendMessage = async ({ message, sent_by, room }) => {
  try {
    const { _id } = room || {};
    const { users } = await groupModel.findOne({ _id, deletedAt: null });

    const body = new messageModel({ sent_by, message, group: _id, users });
    const response = await body.save();
    await groupModel.findByIdAndUpdate(_id, {
      $push: { messages: response._id },
    });
    return response;
  } catch (err) {
    console.log("err", err);
  }
};
