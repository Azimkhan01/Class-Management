const {student, batch} = require('../Database/db')
const isEmpty = (obj) => Object.keys(obj).length === 0;
const getStudents = async(req,res)=>{

    if(req.cookies.staff)
    {
        if(!isEmpty(req.query))
        {
            console.log(req.query)
            // console.log("query called ..")
            const data = await student.find({...req.query}); //if the req
            // console.log(data)
            res.json(data)
        }else{
            // console.log("without query called ..")
            const data = await student.find({});
            // console.log(data)
            res.json(data)
        }
         

    }else{
        res.json({"error":"invalid user is accessing ..."})
    }

}

module.exports = {getStudents}