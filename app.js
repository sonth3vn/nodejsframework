var express = require('express');
var bodyParser = require('body-parser');
require('colors');

/* global module */
global.path = require('path');
global.fs = require('fs');
global.fsx = require('fs.extra');
global.fse = require('fs-extra');
global._ = require('underscore');
global._rootPath = path.dirname(require.main.filename);
global._libsPath = path.normalize(path.join(__dirname, 'libs'));
global._config = require(path.normalize(path.join(__dirname, 'config', 'conf.json')));
global._dbPath = 'mongodb://' + _config.database.ip + ':' + _config.database.port + '/' + _config.database.name;
global._moment = require('moment');
global._async = require('async');
global.jimp = require('jimp');
global.mongoose = require('mongoose');
global.mongodb = require('mongodb');
global.jwt = require('jsonwebtoken');
require(path.join(__dirname, 'libs', 'resource'));

/* module log */
var log4js = require("log4js"),
    log4js_extend = require("log4js-extend");
log4js.configure({
  appenders: [
    {type: 'console'},
    {
      "type": "file",
      "filename": path.join(__dirname, 'logs', 'app.log'),
      "maxLogSize": 20480000,
      "backups": 3,
      "category": "APP"
    }
  ]
});
log4js_extend(log4js, {
  path: __dirname,
  format: "[@name (@file:@line:@column)]"
});
var logger = log4js.getLogger("APP");
logger.setLevel('DEBUG');
global.__log = logger;

/* app-express */
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache', false);
app.set('port', process.env.PORT || _config.app.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('cookie-parser')('sonth@dftvn'));
app.use(require('express-session')({name: 'myApp', secret: 'sonth@dftvn', resave: false, saveUninitialized: true}));
app.use(require('multer')({dest: path.join(__dirname, 'temp')}).any());
//app.use(require('multer')({dest: path.join(__dirname, 'temp')}).fields([{name: 'avatar', maxCount: 1}, {name: 'excel', maxCount: 1}]));
app.use(require('serve-favicon')(path.join(__dirname, 'assets', 'favicon.ico')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(require(path.join(_rootPath, 'libs', 'auth')).auth);
require(path.join(_rootPath, 'libs', 'cleanup.js')).Cleanup();
require(path.join(_rootPath, 'libs', 'router.js'))(app);

/* mongoose connect */
mongoose.connect(_dbPath, options = {
  db: {native_parser: true},
  server: {poolSize: 5},
  user: _config.database.user,
  pass: _config.database.pwd
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('404', {title: '404 | Page not found'});
});

app.use(function (err, req, res, next) {
  __log.error(err);
  if (req.xhr) {
    res.status(500).send(err);
  } else {
    res.status(err.status || 500).render('500', {title: 'Server Error', page: null, message: err});
  }
});

var server = app.listen(app.get('port'), function () {
  __log.info('Server is running at ' + app.get('port'));
});

module.exports = app;
