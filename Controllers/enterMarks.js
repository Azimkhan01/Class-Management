const { student, test } = require('../Database/db');

const enterMarks = async (req, res) => {
    try {
        if (!req.cookies.staff) {
            return res.status(401).json({ status: "Unauthorized person, sorry" });
        }

        const { formData, outOfData } = req.body;

        if (!Array.isArray(formData) || formData.length < 2) {
            return res.status(400).json({ status: "Invalid formData format" });
        }

        // Update test status and outof fields
        const testUpdate = await test.updateOne(
            { batch: formData[1].studentBatch, testClass: formData[1].studentClass, topic: formData[0] },
            {
                $push: {
                    status: true,
                    outof: outOfData,
                },
            }
        );

        console.log(`Test updated:`, testUpdate);

        // Update marks for each student
        for (let i = 1; i < formData.length; i++) {
            const studentMarks = {
                topic: formData[0],
                marks: formData[i].marks,
                outof:outOfData
            };

            console.log(`Processing student: ${formData[i].studentId}`);

            const studentUpdate = await student.updateOne(
                {
                    batch: formData[i].studentBatch,
                    class: formData[i].studentClass,
                    studentid: formData[i].studentId,
                },
                {
                    $push: { test: studentMarks },
                }
            );

            console.log(`Updated student: ${formData[i].studentId}`, studentUpdate);
        }

        res.status(200).json({ status: "done" });
    } catch (error) {
        console.error("Error in enterMarks:", error);
        res.status(500).json({ status: "Internal server error", error: error.message });
    }
};

module.exports = { enterMarks };
