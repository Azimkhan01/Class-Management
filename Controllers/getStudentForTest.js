const { test, student } = require("../Database/db");

const getStudentForTest = async (req, res) => {
    if (!req.cookies.staff) {
        return res.status(403).json({ status: 'Access Denied' });
    }

    try {
        const { batch, class: testClass, topic } = req.query;
        console.table(req.query)

        if (!batch || !testClass || !topic) {
            return res.status(400).json({ status: 'Invalid request parameters' });
        }

        const totalTest = await test.findOne({ batch, testClass: testClass, topic });

        if (!totalTest) {
            return res.status(404).json({ status: 'Test not found' });
        }

        const students = await student.find({
            batch: totalTest.batch,
            class: totalTest.testClass,
        });

        if (!students || students.length === 0) {
            return res.status(404).json({ status: 'No students found for this test' });
        }

        return res.status(200).json({ status: 'success', students , test:totalTest });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ status: 'Internal Server Error', error: error.message });
    }
};

module.exports = { getStudentForTest };
