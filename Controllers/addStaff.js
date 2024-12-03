const { staff } = require("../Database/db");
const NodeCache = require('node-cache');
const bcrypt = require('bcrypt');
const staffCache = new NodeCache();

const addStaff = async (req, res) => {
    const { username, email, password } = req.body;
    
    let staffDetails = staffCache.get("staff-details");
    
    if (staffDetails) {
        if (staffDetails.email === email) {
            return res.json({ 'error': 'The email already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND) ); // Hash the password before saving
            let result = await staff.create({ username, email, password: hashedPassword });
            staffCache.set('staff-details', result);
            return res.json({ 'status': 'Staff created successfully' });
        }
    } else {
        staffDetails = await staff.findOne({ email });
        if (staffDetails) {
            return res.json({ 'error': 'The email already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND)); // Hash the password before saving
            let result = await staff.create({ username, email, password: hashedPassword });
            staffCache.set('staff-details', result);
            return res.json({ 'status': 'Staff created successfully' });
        }
    }
}

module.exports = { addStaff };
