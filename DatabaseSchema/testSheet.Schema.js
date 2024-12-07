const mongoose = require("mongoose");
const testSheetSchema = new mongoose.Schema(
  {
    topic: { type: String },
    chp: { type: String },
    examDate: { type: String },
    batch: { type: String },
    testClass: { type: String },
    note: { type: String },
    subjects: { type: Array },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = { testSheetSchema };
