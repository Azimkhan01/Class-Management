const { student } = require('../Database/db');

const isEmpty = (obj) => Object.keys(obj).length === 0;

const getStudents = async (req, res) => {
  try {
    if (!req.cookies.staff) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    let data;

    if (!isEmpty(req.query)) {
      console.log("Query parameters received:", req.query);
      data = await student.find({ ...req.query });
    } else {
      console.log("Fetching all students...");
      data = await student.find({});
    }
console.log(data)
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getStudents };
