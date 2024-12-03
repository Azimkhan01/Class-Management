const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);


module.exports = { staffSchema };
