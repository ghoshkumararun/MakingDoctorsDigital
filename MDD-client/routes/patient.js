/**
 * Created by mohitp12 on 4/22/17.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var crypto = require('crypto');

function patientHome(req,res)
{
    console.log("redirecting to the patient's dashboard");
    res.render("patient");
}

function patientDetails(req, res)
{

    var data = {"patientID":req.session.pID, "methodName":"patientDetails"};
    mq_client.make_request('patient_Queue',data, function(err,results){
        if(err)
        {
            throw err;
            res.send({"statusCode":"400"});
        }
        else
        {
            if(results.statusCode == "200")
            {
                res.send(results);
            }
            res.send({"statusCode":"200"});
        }
    });

}

function updatePatientDetails(req, res)
{
    var data = {"patientID":req.session.pID, "patient":req.body.patient,"methodName":"updatePatientDetails"};


}

function patientUpdatePassword(req, res)
{
    console.log("this is working");

    if(req.session.pID){
        var encryptOldPassword = crypto.createHash("md5").update(req.body.password.pOldPassword).digest('hex');
        var encryptNewPassword = crypto.createHash("md5").update(req.body.password.pNewPassword).digest('hex');
        console.log(encryptOldPassword+ " :::::: "+ encryptNewPassword);
        var data = {"patientID":req.session.pID,"encryptOldPassword":encryptOldPassword,"encryptNewPassword": encryptNewPassword,"methodName":"patientUpdatePassword"};

        mq_client.make_request('patient_Queue',data, function(err,results){
            if(err){
                throw err;
            }
            else
            {
                res.send(results);

            }
        });
    }
    else
    {
        res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
    }

}

function patientReports(req, res)
{

    res.render('reports');
}


function reports(req, res)
{
    var data = {"patientID":req.session.pID, "methodName":"reports"};
    mq_client.make_request('patient_Queue',data, function(err,results){
        if(err)
        {
            throw err;
            res.send({"statusCode":"400"});
        }
        else
        {
            if(results.statusCode == "200")
            {
                req.send(results);
            }
            res.send({"statusCode":"200"});
        }
    });

}

function reportUpload(req,res)
{
    console.log("here it is");
}

exports.patientHome =patientHome;
exports.patientDetails = patientDetails;
exports.updatePatientDetails = updatePatientDetails;
exports.patientUpdatePassword = patientUpdatePassword;
exports.patientReports = patientReports;
exports.reports = reports;
exports.reportUpload = reportUpload;
