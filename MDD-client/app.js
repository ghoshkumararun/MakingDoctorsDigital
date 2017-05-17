var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var index = require('./routes/index');
var users = require('./routes/users');
var patient = require('./routes/patient');
var doctor = require('./routes/doctor');
var admin = require('./routes/admin');
var session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);
require('./routes/passport')(passport);

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/events');

var app = express();
var doctorLogs = require('./routes/doctorLogs');
var patientLogs = require('./routes/patientLogs');

//Logger
doctorLogs.initializeDLogger();
patientLogs.initializePLogger();

//Passport for login
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//MySQL session store
var options = {
    host: 'localhost',// Host name for database connection.
    port: 3306,// Port number for database connection.
    user: 'root',// Database user.
    password: 'root',// Password for the above database user.
    database: 'mDD_session',// Database name.
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    connectionLimit: 1,// Number of connections when creating a connection pool
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options);
app.use(session({
    key: 'session_cookie_name',
    secret: 'mDDKeyPhrase',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

// Session
app.get('/session', index.session);
app.get('/sessionEnd', index.sessionEnd);


// Users
app.get('/', index.index);
// app.use('/users', users);


//appointment
app.get('/appointment', index.appointment);


app.post('/userSignInAdmin', function(req, res, next) {
    passport.authenticate('admin_login', function(err, user, info) {
        console.log("inside authenticate method");
        console.log(user);

        if(err) {
            return next(err);
        }
        if(!user) {
            return res.send("invalid");
        }
        req.logIn(user, {session:false}, function(err) {
            if(err) {
                return next(err);
            }
            req.session.userName = user.results[0].email;
            req.session.pid = user.results[0].patient_id;
            console.log("session initilized")
            return res.send({"statusCode":"200","signInAs":"admin","msg":"valid patient logging in"});
        })
    })(req, res, next)
});
app.get('/adminHome', admin.adminHome);

app.get('/getEvents', function (req, res){
    var collection = db.get('usercollection');
    //console.log(collection);
    var x = collection.find();

    collection.find({},{},function(e,docs){
        res.send(docs);
    })
    var event = [];
    event = [
        {
            "title": 'new event',
            "startsAt": new Date(2017,4,1,13,30),
            "endsAt": new Date(2017,4,1,14,0),
            "draggable": true,
            "resizable": true
        }
    ];
    var response = {
        statusCode: 200,
        events: x
    }
    //res.send(response);
});

app.post('/addEvents',function doctorSignUp(req,res)
{
    var collection = db.get('usercollection');
    var nummberofAppts = collection.find({},{"startsAt":req.body.startsAt});
    console.log("*************************************"+nummberofAppts);
    collection.insert(req.body, {w: 1}, function(err, records){
        console.log("Record added as ");
    });
    console.log(req.body);
});

//Signup and Signin
app.get('/signup',index.signup);
app.get('/signin', index.signin);

//Doctor
app.post('/doctorSignUp',users.doctorSignUp);
app.post('/userSignInDoctor', function(req, res, next) {
    passport.authenticate('doctor_login', function(err, user, info) {

        console.log(user);

        if(err) {
            return next(err);
        }
        if(!user) {
            return res.send("invalid");
        }
        req.logIn(user, {session:false}, function(err) {
            console.log(user);
            if(err) {
                return next(err);
            }
            req.session.userName = user.results[0].email;
            req.session.dId = user.results[0].doctor_id;
            setTimeout(function () {
                doctorLogs.insertDLog("userID: " + req.session.dId + " logged in");
            }, 0);
            console.log("session initilized")
            return res.send({"statusCode":"200","signInAs":"doctor","msg":"valid doctor logging in"});
        })
    })(req, res, next)
});

app.get('/doctorHome', doctor.doctorHome);


//Patient
app.post('/patientSignUp',users.patientSignUp);
app.post('/userSignInPatient', function(req, res, next) {
    passport.authenticate('patient_login', function(err, user, info) {
        console.log("inside authenticate method");
        console.log(user);

        if(err) {
            return next(err);
        }
        if(!user) {
            return res.send("invalid");
        }
        req.logIn(user, {session:false}, function(err) {
            if(err) {
                return next(err);
            }
            req.session.userName = user.results[0].email;
            req.session.pid = user.results[0].patient_id;
            setTimeout(function () {
                patientLogs.insertPLog("userID: " + req.session.pid + " logged in");
            }, 0);
            console.log("session initilized")
            return res.send({"statusCode":"200","signInAs":"patient","msg":"valid patient logging in"});
        })
    })(req, res, next)
});
app.get('/patientHome', patient.patientHome);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;