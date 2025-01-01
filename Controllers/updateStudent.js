const { student } = require('../Database/db');

const updateStudent = (req, res) => {

    if (req.cookies.staff) {
        res.render('updateStudent')
    } else {
        res.redirect('/login')
    }

}

const updateStudentData = async (req, res) => {
    // Check if the staff cookie exists
    if (req.cookies.staff) {
        try {
            // Destructure the data from the request body
            const { test, id, name, studentWhatsapp, parentWhatsapp, email, gender, studentClass, age, batch, studentId, previousGrade, note } = req.body;
            // console.log(test)
            // Validation check for required fields (you can add more validations here as per your requirements)
            if (!id || !name || !studentWhatsapp || !parentWhatsapp || !email || !studentClass || !age || !batch || !studentId || !previousGrade || !note) {
                return res.status(400).json({ status: false, message: "All fields are required." });
            }

            // Update student data in the database
            let updateStudentHere = await student.updateOne(
                { _id: id },
                {
                    $set: {
                        name,
                        studentWhatsapp,
                        parentWhatsapp,
                        email,
                        gender,
                        class: studentClass,
                        age,
                        batch,
                        studentid: studentId,
                        note,
                        previousGrade
                    }
                }
            );
            test.forEach(async (element) => {
                let updatetheMarks = await student.updateOne({ _id: id, "test.topic": element.topic }, { $set: { "test.$.marks": element.marks } })
                // console.log(updatetheMarks)
            });
            // Check if the update was successful
            if (updateStudentHere.nModified === 0) {
                return res.status(404).json({ status: false, message: "Student data not found or no changes made." });
            }

            // Return success response
            res.json({ status: true, message: "Student data updated successfully." });

        } catch (error) {
            console.error("Error updating student data:", error);
            res.status(500).json({ status: false, message: "Internal server error." });
        }
    } else {
        // If no staff cookie, return a failure response
        res.status(403).json({ status: false, message: "Unauthorized access." });
    }
};


module.exports = { updateStudent, updateStudentData }