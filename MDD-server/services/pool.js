/**
 * Created by mohitp12 on 4/22/17.
 */

var mysql = require('mysql');//importing module
var connectionpool = [];
var maxPoolSize, connectioncount=0;

function getConnection(){
    var connection = mysql.createConnection({
        host : '127.0.0.1',
        user : 'root',
        password : 'root',
        database : 'MDD',
        port : 3306
    });
    return connection;
}

function createPool(initialsize, maxSize){
    console.log("Connection Pool is created");
    maxPoolSize = maxSize;
    for(var i=0;i<initialsize;i++){
        connectionpool.push(getConnection());
    }
}

function getConnectionFromPool(){
    console.log("inside get connection");
    if(connectionpool.length == 0){
        if(connectioncount!=maxSize){
            connectioncount++;
            console.log("Connection no: "+connectioncount);
            return getConnection();
        }
        else{
            console.log("Not available");
            return null;
        }}
    else{
        connectioncount++;
        return connectionpool.pop();
    }
}

function releaseConnection(connection){
    connectioncount--;
    connectionpool.push(connection);
}


exports.createPool=createPool;
exports.getConnectionFromPool=getConnectionFromPool;
exports.releaseConnection=releaseConnection;