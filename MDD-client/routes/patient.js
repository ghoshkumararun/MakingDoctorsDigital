/**
 * Created by mohitp12 on 4/22/17.
 */

function patientHome(req,res)
{
    console.log("redirecting to the patient's dashboard");
    res.render("patient");
}

exports.patientHome =patientHome;
