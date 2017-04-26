/**
 * Created by mohitp12 on 4/22/17.
 */

var crypto = require('crypto');
var mysql = require('./mysql');


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

/*
    var sql1="select  * from tble ";
    var sql2 = "insert into table values.....";

    Promise.all([sql1,sql2]).then({


    }).catch()
*/



}


function handle_request(msg, callback){

    if(msg.methodName == "userSignIn"){
        userSignIn(msg,function(result){
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
    }
}

exports.handle_request = handle_request;