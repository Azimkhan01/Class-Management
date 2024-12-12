const {test} = require('../Database/db');
const testById = async(req,res)=>{
const {id} = req.params
if(req.cookies.staff)
{
    let result = await test.find({"_id":id})
    console.log(result)
    res.json(result)
}
else{
    reset.json({'status':"error"});
}
}

module.exports = {testById}