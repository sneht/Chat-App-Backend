const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    group_name: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        required: false,
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
module.exports = mongoose.model("Group", groupSchema);
