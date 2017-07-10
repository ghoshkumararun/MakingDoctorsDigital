/**
 * Created by mohitp12 on 7/9/17.
 */
var crypto = require('crypto');
var mysql = require('./mysql');

function handle_request(msg, callback){

    if(msg.methodName == "availability"){
        availability(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "reports"){
        updateReports(msg,function(result){
            callback(null,result);
        });
    }else if(msg.methodName == "patientDetails"){
        patientDetails(msg,function(result){
            callback(null,result);
        });
    }
}

exports.handle_request = handle_request;
