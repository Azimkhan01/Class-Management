const { teacher } = require('../Database/db');
const handleTeacher = async (req, res) => {

    //  console.log(req.body);
    const { subjects, teacherName, teacherShort, teacherSubject, teacherStandard } = req.body;
    let addTeacher = await teacher.create({
        teacherSubject: [subjects],
        teacherName: teacherName,
        teacherShort: teacherShort,
        teacherStandard: teacherStandard,
        totalSubjects: teacherSubject,
        totalStandards: teacherStandard.length
    });
    if (addTeacher) {
        console.log("Teacher Added Successfully");

        res.json({ status: "Teacher Added Successfully", error: false });
    }
    else {
        console.log("Error in Adding Teacher");
        res.json({ error: "Error in Adding Teacher", status: false });
    }

};

const getTeacher = async (req, res) => {
    if (req.cookies.staff) {
        let getTeacherData = await teacher.find({})
        if (getTeacherData.length > 0)
            res.json({ status: true, data: getTeacherData })
        else
            res.json({ status: false })
    } else {
        res.json({ status: false, "message": "Unauthorised user only staff can access the data" })
    }


}

const deleteTeacher = async (req, res) => {
    try {
        if (req.cookies.staff) {
            let delTeacher = await teacher.findByIdAndDelete(req.params.id)
            delTeacher 
            ? res.json({status:true,"message":"the teacher will the id :"+req.params.id+" is deleted succesfully"})
            : res.json({status:false,"message":"the teacher will the id :"+req.params.id+" is not deleted"})
        } else {
            res.json({ status: false, "message": "Unauthorised user only staff can access the data" })
        }
    } catch (error) {
        console.log("Error happen in the deleting Teacher:", error)
        res.json({ status: false, "message": error })
    }
}

module.exports = { handleTeacher, getTeacher, deleteTeacher };