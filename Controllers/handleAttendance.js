const { student, batch } = require('../Database/db');

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
}

const handleAttendance = async (req, res) => {
    if (req.cookies.staff) {
        try {
            const { batchName, batchStandard, presentStudents, absentStudents } = req.body;
            console.table(req.body);

            const currentDate = formatDate(new Date());

            let addPresent = await student.updateMany(
                { studentid: { $in: presentStudents } },
                { $push: { present: currentDate } }
            );

            let addAbsent = await student.updateMany(
                { studentid: { $in: absentStudents } },
                { $push: { absent: currentDate } }
            );

            const attendanceRecord = {
                date: currentDate,
                present: presentStudents,
                absent: absentStudents
            };

            let addPresentAbsent = await batch.updateMany(
                { batchName: batchName, batchStandard: batchStandard },
                {
                    $push: { attendance: attendanceRecord }, 
                    $inc: { totalDays: 1 } 
                }
            );

            res.json({ status: "ok", message: "Attendance updated successfully" });
        } catch (error) {
            console.error('Error updating attendance:', error);
            res.status(500).json({ error: "Failed to update attendance, please try again." });
        }
    } else {
        res.status(403).json({ error: "Unauthorized user, staff required" });
    }
};

module.exports = { handleAttendance };
