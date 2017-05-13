/**
 * Created by mohitp12 on 4/22/17.
 */

var ejs= require('ejs');
var mysql = require('mysql');

var pool = require('./pool');


function fetchData(callback, sqlQuery){

    console.log("Fetching data");
    var connection = pool.getConnectionFromPool();

    console.log("after connecting through pool");
    connection.query(sqlQuery, function(err, rows, fields){
        if(err){
            console.log("ERROR: " + err.message);
        }
        else{
            console.log("\nConnection released");
            console.log("Query Success");
            callback(err, rows);
        }
    });
    pool.releaseConnection(connection);
}

function insertData(callback, sqlQuery) {
    console.log("inserting data");
    var connection = pool.getConnectionFromPool();
    connection.query(sqlQuery, function (err, results) {
        if(err){
            console.log("Error: "+err);
            callback(err,results);
        }else{
            console.log("\nConnection released");
            console.log("Query Success");
            callback(err,results);
        }
    });
    pool.releaseConnection(connection);

};

exports.fetchData = fetchData;
exports.insertData = insertData;