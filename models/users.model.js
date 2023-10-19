const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    groups: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Group",
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
module.exports = mongoose.model("User", userSchema);
