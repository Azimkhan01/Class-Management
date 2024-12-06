const {student , batch} = require('../Database/db')

const studentForm = async(req, res) => {
  if (req.cookies.staff) {
  try{
    const {studentName,studentAge,gender,studentClass,batchName,previousGrade,parentWhatsapp,parentEmail,studentWhatsapp} = req.body
    const studentId = async()=>{
     let count = await student.countDocuments({ batch: batchName });
     let batchData = await batch.find({batchName:batchName});
     console.log(batchData[0].batchStandard)
     let standard = batchData[0].batchStandard
     let year = batchData[0].batchYear
    //  console.log('the year',year)
     return `${year.slice(-2)}${standard}${count++}`
    }
    // console.table({id,password})
    let addStudent = await student.create(
     {   name:studentName,
         studentWhatsapp:studentWhatsapp,   
         parentWhatsapp:parentWhatsapp,
         email:parentEmail,
         previousGrade:previousGrade,
         gender:gender,
         class:studentClass,
         age:studentAge,
         batch:batchName,
         image:req.file.filename,
         studentid: (await studentId()).toString(),
         password: (await studentId()).toString()
 }); 
    let addStudentToBatch = 
    await batch.updateOne(
        { batchName: batchName },
        { $push: { students: addStudent['_id'] } } // Correct the field name here if necessary
      );

    res.redirect("/studentOperationStaff");  
}catch(error){
    console.error("Error adding student:", error);
res.status(500).send("While adding the student some error happen "+error)
}
      
    
  } else {
    res.redirect("/login");
  }
};

module.exports = { studentForm };
