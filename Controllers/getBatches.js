const { test , batch } = require("../Database/db.js");
const mongoose = require('mongoose');

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
    }

}



const getSheet = async (req, res) => {
    console.log("Request ID:", req.params.id);

    if (!req.cookies.staff) {
        return res.status(401).json({ error: "Unauthorized. Staff not logged in" });
    }

    // Check if `id` exists and is a valid ObjectId
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid or missing ID" });
    }

    try {
        // Fetch tests from the database
        const tests = await test.find({ '_id': req.params.id });
        if (tests.length > 0) {
            return res.json(tests);
        } else {
            return res.status(404).json({ error: "No test found" });
        }
    } catch (error) {
        console.error("Error fetching tests:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getBatch = async (req, res) => {
    console.log("Request ID:", req.params.id);

    if (!req.cookies.staff) {
        return res.status(401).json({ error: "Unauthorized. Staff not logged in" });
    }
    

    try {
       
        const batchC = await batch.find({ ...req.query });
        if (batchC.length > 0) {
            return res.json(batchC);
        } else {
            return res.status(404).json({ error: "No batch found" });
        }
    } catch (error) {
        console.error("Error fetching tests:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { getBatches , getBatch , getTests , getSheet };
