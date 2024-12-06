const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, studentWhatsapp:{
        type: Number,
      required: true,
    },
    parentWhatsapp:{
        type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },gender:{
        type: String
    },class:{
        type: String,
      required: true,
    },image:{
        type: String
    },age:{
        type: Number
    },batch:{
        type: String
    },studentid:{
        type: String,
        unique:true
    },previousGrade:{
        type: String
    },present:{
      type: Array
  },absent:{
    type: Array
}
  },
  {
    timestamps: true,
    strict: false,
  }
);


module.exports = { studentSchema };
