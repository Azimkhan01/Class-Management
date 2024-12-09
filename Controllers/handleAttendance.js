const { student, batch } = require('../Database/db');

const handleAttendance = async (req, res) => {
    if (req.cookies.staff) {
        try {
            const { batchName, batchStandard, presentStudents, absentStudents } = req.body;
            console.table(req.body);

            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

            // Check if attendance is already recorded for the batch on the current date
            let batchAttendanceExists = await batch.findOne({
                batchName,
                batchStandard
            });

            if (batchAttendanceExists) {
                const attendanceOnCurrentDate = batchAttendanceExists.attendance.some((element) => {
                    const elementDateString = new Date(element.date).toISOString().split('T')[0];
                    return elementDateString === currentDateString;
                });

                // If attendance is already recorded, return the message early
                if (attendanceOnCurrentDate) {
                    console.log("Attendance already recorded for today");
                    return res.json({ status: "ok", message: "Attendance already is taken" });
                }
            }

            // If attendance is not already recorded, proceed with updating the attendance
            await student.updateMany(
                { studentid: { $in: presentStudents } },
                { $addToSet: { present: currentDate } }
            );

            await student.updateMany(
                { studentid: { $in: absentStudents } },
                { $addToSet: { absent: currentDate } }
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

            // Return success message after updating attendance
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
