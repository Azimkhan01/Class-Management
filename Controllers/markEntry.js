const { student, test } = require('../Database/db');

const markEntry = async (req, res) => {
    if (!req.cookies.staff) {
        return res.redirect('/login');
    }

    try {
        // console.table(req.params);

        // Fetch the test based on parameters
        const testFind = await test.findOne({
            batch: req.params.batch,
            testClass: req.params.class,
            topic: req.params.topic,
        });

        if (!testFind) {
            return res.send(`
                Test not found!<br><br> 
                <i>Batch Name</i>: ${(req.params.batch).toUpperCase()} <br><br> 
                <i>Class</i>: ${req.params.class} <br><br> 
                <i>Topic</i>: ${(req.params.topic).toUpperCase()}
            `);
        }

        // Fetch students related to the test
        const students = await student.find({
            batch: testFind.batch,
            class: testFind.testClass, // Ensure 'testClass' exists in your schema
        });

        if (!students || students.length === 0) {
            return res.send("No students found for this test.");
        }
        return res.render('markEntry');
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).send("An error occurred while processing the request. Please try again later.");
    }
};

module.exports = { markEntry };
