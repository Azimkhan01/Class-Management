const { batch } = require("../Database/db.js");
const nodecache = require("node-cache");
let cache = new nodecache();

const getBatches = async (req, res) => {
    if (!req.cookies.staff) {
        return res.status(401).json({ error: "Unauthorized. Staff not logged in" });
    }

    // Check if data is already cached
    let cachedBatches = cache.get("batch");

    if (cachedBatches) {
        return res.json(cachedBatches);
    }

    try {
        const batches = await batch.find({});
        if (batches.length > 0) {
            cache.set("batch", batches); // Cache the data
            return res.json(batches);
        } else {
            return res.status(404).json({ error: "No batches found" });
        }
    } catch (error) {
        console.error("Error fetching batches:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getBatches };
