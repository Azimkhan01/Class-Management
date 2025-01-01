const mongoose = require("mongoose");
const colors = require("colors");
const { staffSchema } = require("../DatabaseSchema/staffSchema");
const { batchSchema } = require("../DatabaseSchema/batchSchema");
const { studentSchema } = require("../DatabaseSchema/studentSchema");
const { testSheetSchema } = require("../DatabaseSchema/testSheet.Schema");
const { teacherSchema } = require("../DatabaseSchema/teacherSchema");
mongoose
  .connect("mongodb://localhost:27017/Student-Management")
  .then(async () => {
    console.log(
      colors.bgBlue.blue(
        "Database Connected Succesfully ::  url(mongodb://localhost:27017/) ::  Database: HomeQuest"
      )
    );
  })
  .catch((err) => {
    console.log(colors.red("while connecting database error occurs:" + err));
  });

  const staff = new mongoose.model("staff",staffSchema);
  const batch = new mongoose.model('batch',batchSchema);
  const student = new mongoose.model('student',studentSchema);
  const test = new mongoose.model('test',testSheetSchema);
const teacher = new mongoose.model("teacher", teacherSchema);
module.exports = {staff , batch , student , test , teacher};