var amqp = require('amqp')
    , util = require('util');

var login = require('./services/handlerequest');
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
});