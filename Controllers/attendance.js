
const attendance = (req,res)=>{

    if(req.cookies.staff)
    {
        res.render("attendance")
    }else{
        res.redirect('/login')
    }

}

module.exports={attendance}