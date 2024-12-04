const mongoose = require("mongoose");
const batchSchema = new mongoose.Schema(
  {
    batchStandard: {
      type: Number,
      required: true,
      trim: true,
    },
    batchName: {
      type: String,
      required: true,
    },
    batchYear: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    students:{
      type:Array
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = { batchSchema };
