const { test, batch } = require("../Database/db");

const addTestSheet = async (req, res) => {
    // console.log('Request received at addTestSheet');

    if (!req.cookies.staff) {
        return res.status(401).json({ status: "error", message: "Unauthorized: Staff not logged in." });
    }

    const { topic, chp, examDate, batch: batchName, class: testClass, note, subjects } = req.body;

    // Validate the required fields
    if (!topic || !chp || !examDate || !batchName || !testClass || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ status: "error", message: "Missing or invalid fields in the request body." });
    }

    try {
        
        const addTest = await test.create({ topic, chp, examDate, batch: batchName, testClass, note, subjects });
        await batch.updateOne(
            { batchName, batchStandard: testClass },
            { $push: { tests: addTest["_id"] } }
        );
        return res.status(200).json({ status: "ok", message: "Test sheet added successfully." });
    } catch (error) {
        console.error('Error adding test sheet:', error);
        return res.status(500).json({ status: "error", message: "Internal server error." });
    }
};

module.exports = { addTestSheet };
