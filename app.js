const express = require("express");
const {batch,student} = require('./Database/db')
const path = require("path");
const colors = require("colors");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const { router } = require("./Routers/SignupRoutes");
const partialsPath = path.join(__dirname, "views/Partials");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);
app.use("/", router);

// await student.updateMany(
//   { studentid: { $in: presentStudents } },
//   { $addToSet: { present: currentDate } } // Prevent duplicate dates
// );

// await student.updateMany(
//   { studentid: { $in: absentStudents } },
//   { $addToSet: { absent: currentDate } } // Prevent duplicate dates
// );

// // Record attendance in the batch
// const attendanceRecord = {
//   date: new Date('2025-01-06T10:45:47.876+00:00'),
//   present: [24120],
//   absent: [24121],
// };

// await batch.updateOne(
//   { batchName, batchStandard },
//   {
//       $push: { attendance: attendanceRecord },
//       $inc: { totalDays: 1 },
//   }
// );

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(
    colors.bgBlue(`Worker ${process.pid} listening at http://127.0.0.1:${port}`)
  );
});

module.exports = app;
