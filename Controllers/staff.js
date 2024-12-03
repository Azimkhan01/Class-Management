
const staff = (req,res)=>{
    if(req.cookies.staff)
    {
        res.render("staff")
    }else{
        res.redirect("/login")
    }

}

module.exports = {staff}