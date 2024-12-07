const { test , batch } = require("../Database/db.js");

const getBatches = async (req, res) => {
    if (!req.cookies.staff) {
        return res.status(401).json({ error: "Unauthorized. Staff not logged in" });
    }

    try {
        // Fetch batches directly from the database
        const batches = await batch.find({});
        if (batches.length > 0) {
            return res.json(batches);
        } else {
            return res.status(404).json({ error: "No batches found" });
        }
    } catch (error) {
        console.error("Error fetching batches:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getTests =async (req,res)=>{

    if (!req.cookies.staff) {
        return res.status(401).json({ error: "Unauthorized. Staff not logged in" });
    }

    try {
        // Fetch batches directly from the database
        const tests = await test.find({});
        if (tests.length > 0) {
            return res.json(tests);
        } else {
            return res.status(404).json({ error: "No test found" });
        }
    } catch (error) {
        console.error("Error fetching tests:", error);
        return res.status(500).json({ error: "Internal server error" });
    }a

}

module.exports = { getBatches , getTests };
