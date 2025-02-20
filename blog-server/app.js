var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//use the db.js module to establish the initial connection:
var client = require('./db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blog');
var loginRouter = require('./routes/login');
var apiRouter = require('./routes/api');
var loginRedirectRouter = require('./routes/editor');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//check for credential before public routing 
app.use('/editor', loginRedirectRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/blog', blogsRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);


// Connect to Mongo on start
client.connect('mongodb://localhost:27017', function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
