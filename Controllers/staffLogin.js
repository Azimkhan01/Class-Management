const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { staff } = require("../Database/db");

const staffLogin = async (req, res) => {
  const { staffEmail, staffPassword } = req.body;

  if (!staffEmail || !staffPassword) {
    return res.render("login", {
      status: "Please provide both email and password!",
    });
  }

  try {
    // Find the staff by email
    const result = await staff.findOne({ email: staffEmail });

    if (!result) {
      return res.render("login", {
        status: "No staff found with this email!",
      });
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(staffPassword, result.password);
    if (!isMatch) {
      return res.render("login", {
        status: "Incorrect password!",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: result._id, email: result.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in a cookie
    res.cookie("staff", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    });

    // Redirect to the staff dashboard
    res.redirect("/staff");
  } catch (error) {
    console.error("Error during staff login:", error);
    return res.render("login", {
      error: "Something went wrong! Please try again later.",
    });
  }
};

module.exports = { staffLogin };
