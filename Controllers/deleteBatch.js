const { batch } = require("../Database/db.js");
const nodecache = require("node-cache");
let cache = new nodecache();

const deleteBatch = async (req, res) => {
    if (!req.cookies.staff) {
        return res.status(401).json({ error: "Unauthorized. Staff not logged in" });
    }

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Batch ID is required" });
    }

    try {
        const deletedBatch = await batch.deleteOne({ _id: id });

        if (deletedBatch.deletedCount > 0) {
            cache.del("batch"); // Invalidate the cache
            return res.json({ status: "Batch deleted successfully" });
        } else {
            return res.status(404).json({ error: "Batch not found" });
        }
    } catch (error) {
        console.error("Error deleting batch:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { deleteBatch };
