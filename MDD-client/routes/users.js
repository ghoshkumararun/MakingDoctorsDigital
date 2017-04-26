var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var crypto = require('crypto');

function getEncrypt (password) {
    var hash = crypto.createHash("md5").update(password).digest('hex');
    return hash;
}

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

function doctorSignUp(req,res)
{
    console.log("inside the doctor signup module");
    console.log(req.body);

    var encryptPassword = crypto.createHash("md5").update(req.body.doctorDetails.dPassword).digest('hex');

    var data = {"dEmail":req.body.doctorDetails.dEmail, "dPassword": encryptPassword, "dFirstName":req.body.doctorDetails.dFirstName,"dLastName": req.body.doctorDetails.dLastName, "dPhoneNumber":req.body.doctorDetails.dPhoneNumber,"dAddress":req.body.doctorDetails.dAddress+", "+req.body.doctorDetails.dCity+", "+req.body.doctorDetails.dState+"- "+req.body.doctorDetails.dZip,"methodName":"doctorSignUp"};

    mq_client.make_request('login_Queue',data, function(err,results){
        if(err)
        {
            throw err;
            res.send({"statusCode":"200"});
        }
        else
        {
            if(results.statusCode == "200")
            {
                req.session.data={"dEmail":results.dEmail};
            }
            res.send({"statusCode":"200"});
        }
    });

    console.log("redirecting to signup.ejs----> doctorSignUp");

}

function userSignInDoctor(req,res)
{
    console.log("Inside the doctor signin");
    console.log(req.body);
}

function patientSignUp(req,res)
{
    console.log("inside the patient signup module");
    console.log(req.body);
    res.send({"res.data.statusCode":"200"});
}

function userSignInPatient(req,res)
{
    console.log("Inside the patient signin");
    console.log(req.body);
}


exports.doctorSignUp=doctorSignUp;
exports.userSignInDoctor=userSignInDoctor;
exports.patientSignUp = patientSignUp;
exports.userSignInPatient=userSignInPatient;
// module.exports = router;

