var express = require('express');
var path = require("path");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongodb.host);
mongoose.Promise = global.Promise;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/../public/'));

var api = require('./routes/api');
var routes = require('./routes/routes');
app.use('/api', api);
// app.use('/', routes);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.listen(3000, function () {
    console.log('listening on port 3000');
});

module.exports = app;
