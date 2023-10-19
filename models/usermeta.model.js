const mongoose = require("mongoose");

const userMetaSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usermeta", userMetaSchema);
