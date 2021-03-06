var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var jsx = require("node-jsx").install();//增加jsx支持

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

var ejs = require('ejs');
app.engine('.html',ejs.__express);   //使用ejs模板引擎解析html视图文件
app.set('view engine', 'html');

// uncomment after placing your favicon in /dist
app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'dist')));

app.use(express.static(path.join(__dirname, 'dist')));



app.get('/*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});


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
