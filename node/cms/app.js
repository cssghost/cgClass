
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');

var lesscAll = require("./tools/lessc-all");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({uploadDir:'./public/images/uploads'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/robot', routes.robot);
app.get('/robot-body', routes.robotBody);
app.post('/robot/chat', routes.robotChatBg);
app.get('/hello', routes.hello);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
    lesscAll.lesscAll();
  console.log('Express server listening on port ' + app.get('port'));
});