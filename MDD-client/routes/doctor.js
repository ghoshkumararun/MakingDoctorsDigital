/**
 * Created by mohitp12 on 4/22/17.
 */
function doctorHome(req,res)
{
    console.log("redirecting to the doctor's dashboard");
    res.render("doctor");
}

exports.doctorHome =doctorHome;

