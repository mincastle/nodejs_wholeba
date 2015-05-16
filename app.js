var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');  //session
var redis = require('redis'); // redis
var RedisStore = require('connect-redis')(session); // session을 redis에 저장하여 세션을 유지시킨다.
var fs = require('fs');
var client = redis.createClient();

var routes = require('./routes/index');
var users = require('./routes/users');
var couple = require('./routes/couple');
var ddays = require('./routes/ddays');
var loves = require('./routes/loves');
var missions = require('./routes/missions');
var items = require('./routes/items');
var setting = require('./routes/setting');

var test = require('./test/post_test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /user_public
//app.use(favicon(__dirname + '/user_public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'user_public')));

/*
 {
 "host": "127.0.0.1",
 "port": 6379,
 "ttl" : 6000,
 "db" : 6
 }
 */
var options = require('./models/db_redisconfig');

options.client = client;

// redis-session
app.use(session({
  secret: 'keyboard cat',
  store: new RedisStore(options),
  saveUninitialized: false, // don't create session until something stored,
  resave: false // don't save session if unmodified
}));
//session
//app.use(session({
//  secret: 'keyboard cat',
//  resave: false
//}));
app.use(function (req, res, next) {
  if (!req.session) {
    return next('oh no'); // handle error
  }
  next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/couple', couple);
app.use('/loves', loves);
app.use('/ddays', ddays);
app.use('/missions', missions);
app.use('/items', items);
app.use('/setting', setting);
app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error', {
    //  message: err.message,
    //  error: err
    //});
    res.json({"result" : err});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var http = require('http');
var https = require('https');

var httpsOptions = {
  key: fs.readFileSync('./key.pem', 'utf-8'), // key.pem을 utf-8로 읽는다.
  cert: fs.readFileSync('./server.crt', 'utf-8') // server.crt 파일을 utf-8로 읽는다.
};

var server = http.createServer(app);
var https_server = https.createServer(httpsOptions, app);
var port = 80;
var https_port = 443;
server.listen(port, function () {
  console.log('http 서버가 ' + port + '에서 실행중입니다!');
});
https_server.listen(https_port, function () {
  console.log('https 서버가 ' + https_port + '에서 실행중입니다!');
});

var mariadb = require('./models/db_config');
mysql.createConnection(mariadb).connect(function (err) {
  if(err) console.log('err', err);
  console.log('mariadb connected!');
  require('./schedule/scheduler_mission');
});

module.exports = app;
