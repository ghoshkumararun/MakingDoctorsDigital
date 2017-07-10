var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

function index(req,res)
{
    res.render('index', { title: 'Making Doctors Digital' });
}

function signup(req,res)
{
    console.log("inside the signup module");
    res.render('signup');
}

function signin(req,res)
{
    console.log("inside the signin function");
    res.render('signin');
}

function appointment(req,res)
{
    console.log("inside the appointment module");
    res.render('appointment');
}


function session(req,res){
    console.log("inside session");
    console.log(req.session.data);

    if(req.session.data){
        console.log("Session Exists..");
        res.send({"status":"200","signInAs":req.session.data.signInAs});
    }
    else{
        console.log("NO Session Exists..");
        var result={"status":"400"};
        res.send(result);
    }
}

function logout(req,res){

    if(req.session.data){
        console.log("Session Exists..Destroying Session");
        req.session.destroy();
        console.log("Session Destroyed");
    }

    console.log("NO Session Exists..");
    // var result={"status":"200"};
    // res.send(result);
    res.render("index");
}

exports.index = index;
exports.signup = signup;
exports.signin = signin;
exports.appointment = appointment;
exports.session=session;
exports.logout=logout;

