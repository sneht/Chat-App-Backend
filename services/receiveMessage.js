const groupModel = require("../models/group.model");

exports.getAllMessages = async (room, userData) => {
  try {
    const { _id } = room || {};
    const _idString = userData._id.toString();
    const findMessageByGroup = await groupModel
      .findById({ _id })
      .populate("messages");
    const { messages } = findMessageByGroup || {};
    const finalMessage = messages.map((item) => {
      const visibleMessage = item.users.map((res) => {
        const resString = res.toString();
        if (resString === _idString) {
          return item;
        }
      });
      const [finalVisibleMessage] = visibleMessage?.filter(
        (res) => res !== undefined || null
      );
      return finalVisibleMessage;
    });
    const filteredFinalMessage = finalMessage.filter((item) => item);
    return JSON.stringify(filteredFinalMessage || []);
  } catch (err) {
    console.log("err", err);
  }
};
