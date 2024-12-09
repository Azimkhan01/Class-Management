const {test , batch:BATCH} = require("../Database/db");
const addMarks = async (req, res) => {
    if (req.cookies.staff) {
        try {
            const { testClass, batch, topic, note, subjects } = req.body;

            if (!testClass || !batch || !topic || !note || !subjects) {
                return res.status(400).json({ status: false, message: 'Missing required fields' });
            }

            let AddTest = await test.create({testClass,batch,topic,subjects,note})
// console.log(AddTest)
let updateBatch =await BATCH.updateOne({batchName:batch,batchStandard:testClass},{$push:{tests:AddTest["_id"]}})
            // console.log(testClass, batch, topic,subjects,note);

            res.json({ status: true, message: 'Marks added successfully!' });
        } catch (error) {
            console.error('Error in addMarks:', error);
            res.status(500).json({ status: false, message: 'Internal server error' });
        }
    } else {
        res.json({ status: false, message: 'Unauthorized access' });
    }
};

module.exports = { addMarks };
