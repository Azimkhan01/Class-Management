
const view = (req,res)=>{

    if(req.cookies.staff || req.cookies.student)
    {

        console.log(req.params.id)
        res.render('view')

    }else{
        res.redirect("/login")
    }

}

module.exports = {view}