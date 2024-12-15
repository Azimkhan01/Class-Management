const updateStudent = (req,res)=>{

    if(req.cookies.staff)
    {
        res.render('updateStudent')
    }else{
        res.redirect('/login')
    }

}

module.exports = {updateStudent}