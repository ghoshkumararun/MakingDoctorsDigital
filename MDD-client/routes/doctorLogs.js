/**
 * Created by mohitp12 on 4/22/17.
 */

"use strict";
const winston = require('winston');
const fs = require('fs');
const env = process.env.NOV_ENV || 'development';
const logDir = 'logs';
var logger;


exports.initializeDLogger = function () {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }else{

    }

    const tsFormat = function() {(new Date()).toLocaleString()};

    logger = new (winston.Logger)({
        transports: [
            new(winston.transports.File)({
                filename : 'logs/doctorLogs.log',
                timestamp: tsFormat,
                level: env === 'development' ? 'debug' : 'info'
            })
        ]
    });
}



exports.insertDLog = function (msg) {

    logger.info(msg);
}