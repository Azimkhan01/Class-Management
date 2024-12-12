const express = require("express");
const multer = require('multer')
const router = express.Router();
const fs = require("fs");
let {  } = require("../Database/db");
const { staff } = require("../Controllers/staff");
const { staffOperation } = require("../Controllers/staffOperation");
const { addStaff } = require("../Controllers/addStaff");
const { login } = require("../Controllers/login");
const { studentLogin } = require("../Controllers/studentLogin");
const { staffLogin } = require("../Controllers/staffLogin");
const { studentOperationStaff } = require("../Controllers/studentOperation");
const { addBatch } = require("../Controllers/addBatch");
const { getBatches, getSheet, getBatch } = require("../Controllers/getBatches");
const { deleteBatch } = require("../Controllers/deleteBatch");
const { studentForm } = require("../Controllers/studentForm");
const {studentImage} = require('../Controllers/studentImageListing');
const {getStudents} = require("../Controllers/getStudents");
const { attendance } = require("../Controllers/attendance");
const { handleAttendance } = require("../Controllers/handleAttendance");
const {addTestSheet} = require('../Controllers/addTestSheet');
const { view } = require("../Controllers/view");
const { addMarks } = require("../Controllers/addMarks");
const { getTests } = require("../Controllers/getTests");
const { markEntry } = require("../Controllers/markEntry");
const { getStudentForTest } = require("../Controllers/getStudentForTest");
// Images

const uploadStudentImage =  multer({ 
    storage: studentImage
  });

//error
// router.route("*").get(error);

//get request
router.route(['/login','/']).get(login)
router.route("/staff").get(staff)
router.route("/staffOperation").get(staffOperation);
router.route("/studentOperationStaff").get(studentOperationStaff);
router.route("/getBatches").get(getBatches);
router.route("/getSheet/:id").get(getSheet);
router.route("/getBatch").get(getBatch);
router.route("/deleteBatch/:id").get(deleteBatch);
router.route("/getStudents").get(getStudents);
router.route('/attendance').get(attendance);
router.route("/view/:id").get(view);
router.route("/getTests").get(getTests);
router.route("/markEntry/:batch/:class/:topic").get(markEntry);
router.route('/getStudentForTest').get(getStudentForTest);
//post request
router.route("/addStaff").post(addStaff)
router.route("/student-login").post(studentLogin);
router.route("/staff-login").post(staffLogin);
router.route("/addBatch").post(addBatch);
router.route("/studentForm")
  .post(uploadStudentImage.single("studentImage"), studentForm);
router.route("/handleAttendance").post(handleAttendance);
router.route('/addTestSheet').post(addTestSheet);
router.route('/addMarks').post(addMarks);
module.exports = { router };
