const {teacher} = require('../Database/db');
const handleTeacher = async(req,res)=>{

//  console.log(req.body);
 const {subjects, teacherName, teacherShort, teacherSubject, teacherStandard} = req.body;
let addTeacher = await teacher.create({
    teacherSubject:[subjects] ,
     teacherName : teacherName ,
      teacherShort : teacherShort ,
     teacherStandard : teacherStandard,
      totalSubjects : teacherSubject,  
      totalStandards : teacherStandard.length
    });
 if(addTeacher){
    console.log("Teacher Added Successfully");
    
     res.json({status:"Teacher Added Successfully",error:false});}
else{
console.log("Error in Adding Teacher");
    res.json({error:"Error in Adding Teacher",status:false});
}

};

module.exports = {handleTeacher};