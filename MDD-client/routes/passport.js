/**
 * Created by mohitp12 on 4/26/17.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var mq_client = require('../rpc/client');
var crypto = require('crypto');

function getEncrypt (password) {
    var hash = crypto.createHash("md5").update(password).digest('hex');
    return hash;
}

module.exports = function (passport) {
    passport.use('doctor_login', new LocalStrategy({

        emailField: 'email',
        passwordField: 'password'

    },function (email, password, done) {

        var encryptPassword = crypto.createHash("md5").update(password).digest('hex');
        console.log("inside passport.js");
        console.log("Username is: "+email);
        console.log("Password is: "+encryptPassword);
        var msg_payload = {"dEmail": email, "dPassword": encryptPassword, "methodName": "userSignInDoctor"};
        mq_client.make_request('login_Queue', msg_payload, function (err, results) {
            if (err) {
                console.log(err);
            }
            else {
                done(null, results);
            }
        });
    }));
    passport.use('patient_login', new LocalStrategy({

            emailField: 'email',
            passwordField: 'password'

        },function (email, password, done) {

            var encryptPassword = crypto.createHash("md5").update(password).digest('hex');
            console.log("inside passport.js");
            console.log("Username is: "+email);
            console.log("Password is: "+encryptPassword);
            var msg_payload = {"pEmail": email, "pPassword": encryptPassword, "methodName": "userSignInPatient"};
            mq_client.make_request('login_Queue', msg_payload, function (err, results) {
                if (err) {
                    console.log(err);
                }
                else {
                    done(null, results);
                }
            });
        }));
};