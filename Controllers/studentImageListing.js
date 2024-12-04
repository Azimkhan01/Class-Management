const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer Storage Configuration
const studentImage = multer.diskStorage({
  destination: function (req, file, cb) {
    let directory;

    // Set the directory based on the field name
    if (file.fieldname === "studentImage") {
      directory = path.join(__dirname, `../public/Assets/Student_Images`);
      console.log(directory)
    } else {
      return cb(new Error("Invalid file field name"), false);
    }

    try {
      // Ensure the directory exists
      fs.mkdirSync(directory, { recursive: true });
      cb(null, directory);
    } catch (err) {
      cb(new Error("Error creating directory"), false);
    }
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    let filename;

    // Generate a unique filename
    if (file.fieldname === "studentImage") {
       
      filename = `${req.body.batchName}-studentImage-${req.body.studentName}${fileExtension}`;
      console.log(filename)
    } else {
      return cb(new Error("Invalid file field name"), false);
    }

    cb(null, filename);
  },
});


// Export the Multer Configuration
module.exports = {
  studentImage
};
