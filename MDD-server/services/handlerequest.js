/**
 * Created by mohitp12 on 4/22/17.
 */

var crypto = require('crypto');
var mysql = require('./mysql');


function userSignInDoctor(msg, callback) {
    console.log("into doctor signin function");
    var json_responses;
    var doctorSignIn = "select doctor_id, email from doctor_info where email='" + msg.dEmail + "' AND password='"+ msg.dPassword +"'";
    console.log(doctorSignIn);
    // check user already exists

    mysql.fetchData(function (err, results)
    {
        console.log("The doctor database consists of: ");
        console.log(results);
        if (results.length > 0)
        {
            console.log("email exists");
            json_responses = {"statusCode": 200,"msg":"valid user","results":results}
            callback(json_responses);
        }
        else
        {
            json_responses = {"statusCode": 401,"msg":"invalid user or credentials"};
            callback(json_responses);
        }
    },userSignIn);

}


function userSignInPatient(msg, callback) {
    console.log("into patient signin function");
    var json_responses;
    var patientSignIn = "select patient_id, email from patient_info where email='" + msg.pEmail + "' AND password='"+ msg.pPassword +"'";
    console.log(patientSignIn);
    // check user already exists

    mysql.fetchData(function (err, results)
    {
        console.log("The Patient database consists of: ");
        console.log(results);
        if (results.length > 0)
        {
            console.log("email exists");
            json_responses = {"statusCode": 200,"msg":"valid user","results":results}
            callback(json_responses);
        }
        else
        {
            json_responses = {"statusCode": 401,"msg":"invalid user or credentials"};
            callback(json_responses);
        }
    },patientSignIn);
}

function userSignInAdmin(msg, callback) {
    console.log("into admin signin function");
    var json_responses;
    var adminSignIn = "select admin_id, admin_email from admin_info where admin_email='" + msg.aEmail + "' AND password='"+ msg.aPassword +"'";
    console.log(adminSignIn);
    // check user already exists

    mysql.fetchData(function (err, results)
    {
        console.log("The *Admin* database consists of: ");
        console.log(results);
        if (results.length > 0)
        {
            console.log("email exists");
            json_responses = {"statusCode": 200,"msg":"valid user","results":results}
            callback(json_responses);
        }
        else
        {
            json_responses = {"statusCode": 401,"msg":"invalid user or credentials"};
            callback(json_responses);
        }
    },adminSignIn);
}

function doctorSignUp(msg, callback){

    console.log("into doctor signup function");
    var json_responses;
    var checkEmail = "select email from doctor_info where email='" + msg.dEmail + "'";
    console.log(checkEmail);
    // check user already exists

    mysql.fetchData(function (err, results)
    {
        console.log(results);
        if (results.length > 0)
        {
            console.log("email exists");
            json_responses = {"statusCode": 401,"msg":"user already exists!"};
            callback(json_responses);
        }
        else
        {
            var insertDoctor= "INSERT INTO `doctor_info`(`first_name`, `last_name`, `email`, `password`, `phone_number`, `address`) VALUES ("+"'"+msg.dFirstName+"', '"+msg.dLastName+"', '"+msg.dEmail+"','"+msg.dPassword+"','"+msg.dPhoneNumber+"','"+msg.dAddress+"')";
            console.log(insertDoctor)
            mysql.insertData(function (err, results)
            {
                if (results.affectedRows > 0)
                {
                    console.log("valid Login");
                    json_responses = {"statusCode": 200,"email":msg.dEmail};
                    callback(json_responses);
                }
                else
                {
                    json_responses = {"statusCode": 401,"msg":"some error occured while registering"};
                    callback(json_responses);
                }
            }, insertDoctor);
        }
    }, checkEmail);
}

function patientSignUp(msg, callback){
    console.log("into patient signup function");
    console.log("*******************************************");
    console.log(msg);

    var json_responses;
    var checkEmail = "select email from patient_info where email='" + msg.pEmail + "'";
    console.log(checkEmail);
    // check user already exists

    mysql.fetchData(function (err, results)
    {
        console.log(results);
        if (results.length > 0)
        {
            console.log("email exists");
            json_responses = {"statusCode": 401,"msg":"user already exists!"};
            callback(json_responses);
        }
        else
        {
            var insertPatient= "INSERT INTO `patient_info`(`first_name`, `last_name`, `email`, `password`, `phone_number`, `address`,`cCCNo`, `cCVV`, `cExpDate`) VALUES ("+"'"+msg.pFirstName+"', '"+msg.pLastName+"', '"+msg.pEmail+"','"+msg.pPassword+"','"+msg.pPhoneNumber+"','"+msg.pAddress+"','"+msg.pCreditCardNumber+"','"+msg.pCreditCardSC+"','"+msg.pExpDate+"')";
            console.log(insertPatient)
            mysql.insertData(function (err, results)
            {
                if (results.affectedRows > 0)
                {
                    console.log("valid Login");
                    json_responses = {"statusCode": 200,"email":msg.pEmail};
                    callback(json_responses);
                }
                else
                {
                    json_responses = {"statusCode": 401,"msg":"some error occured while registering"};
                    callback(json_responses);
                }
            }, insertPatient);
        }
    }, checkEmail);
}


function handle_request(msg, callback){

    if(msg.methodName == "userSignInDoctor"){
        userSignInDoctor(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "doctorSignUp"){
        doctorSignUp(msg,function(result){
            callback(null,result);
        });
    } else if(msg.methodName == "patientSignUp"){
        console.log("Req in customer backend");
        patientSignUp(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "userSignInPatient"){
        userSignInPatient(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "userSignInAdmin"){
        userSignInAdmin(msg,function(result){
            callback(null,result);
        });
    }
}

exports.handle_request = handle_request;