const { batch } = require("../Database/db");
const nodecache = require("node-cache");
let cache = new nodecache();

const addBatch = async (req, res) => {
    if (!req.cookies.staff) {
        return res.status(401).json({ error: "Unauthorized. Staff not logged in" });
    }

    const { batchStandard, batchName, batchYear, startDate, endDate } = req.body;

    if (!batchStandard || !batchName || !batchYear || !startDate || !endDate) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await batch.create({ batchStandard, batchName, batchYear, startDate, endDate });
        if (result) {
            cache.del("batch"); // Invalidate the cache
            return res.json({ status: "Batch created successfully" });
        } else {
            return res.status(500).json({ error: "Failed to create batch" });
        }
    } catch (error) {
        console.error("Error creating batch:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addBatch };
