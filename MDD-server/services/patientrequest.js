/**
 * Created by mohitp12 on 7/9/17.
 */
var crypto = require('crypto');
var mysql = require('./mysql');


function reports(msg, callback){
    // var patientReports = "select doctor_id, email from doctor_info where email='" + msg.userName + "' AND password='"+ msg.dPassword +"'";
    if(req.session.data){

        var imagePath;
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, '../public/uploads/reports/'+msg.patientID);
            },
            filename: function (req, file, cb) {
                var datetimestamp = Date.now();
                imagePath = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
                cb(null, imagePath);
            }
        });

        var upload = multer({ storage: storage}).single('file');

        upload(req,res,function(err){
            if(err){
                res.json({error_code:1,err_desc:err});
                return;
            }


            var data = {"fKey":req.session.data.key,"pID":req.body.productDetails.pID,"pName":req.body.productDetails.pName,"pPrice":req.body.productDetails.pPrice,"pDesc":req.body.productDetails.pDesc,"pImage":imagePath,"methodName":"updateProduct"};
            console.log("///////////////////////////////////////////");

            console.log(req.session.data.key);
            console.log(data);

            console.log("///////////////////////////////////////////");
            mq_client.make_request('farmer_queue',data, function(err,results){
                if(err){
                    throw err;
                }
                else
                {
                    res.send(results);

                }
            });
        });

    }
    else
    {
        res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
    }

}

function patientDetails(msg, callback)
{
    var json_responses;
    var patientDetails = "select first_name, last_name, email, password, phone_number, address, city, state, zip, cCCNo, cCVV, cExpDate from patient_info where patient_id='" + msg.patientID + "'";

    mysql.fetchData(function (err, results)
    {
        if (results.length > 0)
        {
            json_responses = {"statusCode": 200,"msg":"details fetched to update","patient":results[0]}
            callback(json_responses);
        }
        else
        {
            json_responses = {"statusCode": 401,"msg":"invalid user or credentials"};
            callback(json_responses);
        }
    },patientDetails);

}

function updatePatientDetails(msg, callback)
{
    var updatePatientDetails = "update patient_info SET first_name='" + msg.patient.pFirstName + "', last_name='"+msg.patient.pLastName+"', email='"+msg.patient.pEmail+ "',phone_number="+msg.patient.pPhoneNumber+ ",address='"+msg.patient.pAddress+ "',city='"+msg.patient.pCity+ "',state='"+msg.patient.pState+ "',zip='"+msg.patient.pZip+ "' where patient_id="+msg.patientID;
}


function patientUpdatePassword(msg, callback)
{

    console.log("inside server: ", msg);

    var oldPassword = "SELECT password FROM patient_info where patient_id="+msg.patientID;
    mysql.fetchData(function (err, results)
    {
        if (results.length > 0)
        {
            if(msg.encryptOldPassword === results[0].password)
            {
                var updatePassword = "UPDATE patient_info SET password= '"+msg.encryptNewPassword + "' where patient_id="+msg.patientID;

                mysql.fetchData(function (err, results)
                {
                    if (results.affectedRows > 0)
                    {
                        json_responses = {"statusCode": 200,"msg":"password updated"}
                        console.log("this is the patient password update: ", json_responses);
                        callback(json_responses);
                    }
                    else
                    {
                        json_responses = {"statusCode": 401,"msg":"invalid user or credentials"};
                        callback(json_responses);
                    }
                },updatePassword);
            }
            else
            {
                json_responses = {"statusCode": 401,"msg":"old password don't match"};
                callback(json_responses);
            }
        }
        else
        {
            json_responses = {"statusCode": 401,"msg":"invalid user or credentials"};
            callback(json_responses);
        }
    },oldPassword);

}

function handle_request(msg, callback){

    if(msg.methodName == "reports"){
            reports(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "updateReports"){
            updateReports(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "patientDetails"){
            patientDetails(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "updatePatientDetails"){
            updatePatientDetails(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "patientUpdatePassword"){
        patientUpdatePassword(msg,function(result){
            callback(null,result);
        });
    }
}

exports.handle_request = handle_request;