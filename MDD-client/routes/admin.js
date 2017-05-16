/**
 * Created by mohitp12 on 5/16/17.
 */

function adminHome(req,res)
{
    console.log("redirecting to the admin's dashboard");
    res.render("admin");
}

exports.adminHome =adminHome;