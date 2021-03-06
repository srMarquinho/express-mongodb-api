var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');

// db setup
var mongo = require('mongodb');
switch (process.env.NODE_ENV) {
  case "production":
    // set production db
    // var db = require('monk')('');
    break;
  case "test":
    var db = require('monk')('localhost:27017/express_mongodb_api_test');
    break;
  default:
    var db = require('monk')('localhost:27017/express_mongodb_api');
}

var index = require('./routes/index');
var api = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());

// routes
app.use(function(req, res, next){ req.db = db; next(); });
app.use('/', index);
app.use('/api', api);

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
