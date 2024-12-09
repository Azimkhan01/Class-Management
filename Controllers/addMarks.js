const {test,batch} = require("../Database/db");
const addMarks = async (req, res) => {
    if (req.cookies.staff) {
        try {
            const { testClass, batch, topic, id, subjects } = req.body;

            if (!testClass || !batch || !topic || !id || !subjects) {
                return res.status(400).json({ status: false, message: 'Missing required fields' });
            }

            let AddTest = await test.create({})

            console.log(testClass, batch, topic, id, subjects);

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
