var amqp = require('amqp')
    , util = require('util');

var login = require('./services/handlerequest');
var patient = require('./services/patientrequest');
var doctor = require('./services/doctorrequest');
var pool = require('./services/pool');
//var home = require('./services/');
//var profile = require('./services/');

pool.createPool(10,100);

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function()
{
    cnn.queue('login_Queue', function(q){
        console.log("listening on login_Queue");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            login.handle_request(message, function(err,res){
                console.log(message);
                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });

    cnn.queue('patient_Queue', function(q){
        console.log("listening on patient_Queue");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            patient.handle_request(message, function(err,res){
                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });

    cnn.queue('doctor_Queue', function(q){
        console.log("listening on doctor_Queue");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            doctor.handle_request(message, function(err,res){
                console.log(message);
                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });
});