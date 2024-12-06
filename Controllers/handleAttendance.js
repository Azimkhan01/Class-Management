const { student, batch } = require('../Database/db');



const handleAttendance = async (req, res) => {
    if (req.cookies.staff) {
        try {
            const { batchName, batchStandard, presentStudents, absentStudents } = req.body;
            console.table(req.body);

            const currentDate = new Date();

            // Check if attendance is already recorded for the batch on the current date
            const batchAttendanceExists = await batch.findOne({
                batchName,
                batchStandard,
                'attendance.date': currentDate,
            });

            if (batchAttendanceExists) {
                console.log("already taken")
                return res.json({ status: "ok", message: "Attendance for today is already recorded." });
            }

            // Update student attendance
            await student.updateMany(
                { studentid: { $in: presentStudents } },
                { $addToSet: { present: currentDate } } // Prevent duplicate dates
            );

            await student.updateMany(
                { studentid: { $in: absentStudents } },
                { $addToSet: { absent: currentDate } } // Prevent duplicate dates
            );

            // Record attendance in the batch
            const attendanceRecord = {
                date: currentDate,
                present: presentStudents,
                absent: absentStudents,
            };

            await batch.updateOne(
                { batchName, batchStandard },
                {
                    $push: { attendance: attendanceRecord },
                    $inc: { totalDays: 1 },
                }
            );

            res.json({ status: "ok", message: "Attendance updated successfully" });
        } catch (error) {
            console.error('Error updating attendance:', error.message);
            res.status(500).json({ error: "Failed to update attendance, please try again." });
        }
    } else {
        res.status(403).json({ error: "Unauthorized user, staff required" });
    }
};

module.exports = { handleAttendance };
