const studentOperationStaff = (req,res)=>{
if(req.cookies.staff)
{

    res.render("studentOperationStaff")

}else{
    res.redirect("/login")
}
}

module.exports = {studentOperationStaff}