const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sent_by: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    group: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    deletedAt: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", messageSchema);
