const {test} = require("../Database/db");
const getTests = async(req,res)=>{

if(req.cookies.staff)
{
    let testResult = await test.find({});
    // let student = await student.find(...req.query);
    if(testResult)
    {
        res.json(testResult);
    }else{
        res.json({"status":"No result or some problem happen restart the application."});
    }
}

}

module.exports = {getTests}