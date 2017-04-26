var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var patient = require('./routes/patient');
var doctor = require('./routes/doctor');

var session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);

var app = express();

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


// session

app.get('/session', index.session);
app.get('/sessionEnd', index.sessionEnd);

// Users
app.get('/', index.index);
// app.use('/users', users);

//Signup and Signin
app.get('/signup',index.signup);
app.get('/signin', index.signin);

//Doctor
app.post('/doctorSignUp',users.doctorSignUp);
app.post('/userSignInDoctor', users.userSignInDoctor );

//Patient
app.post('/patientSignUp',users.patientSignUp);
app.post('/userSignInPatient', users.userSignInPatient );

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