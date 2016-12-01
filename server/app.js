var express = require('express');
var path = require("path");
var mongoose = require('mongoose');
mongoose.connect('mongodb://joker:jp@ds113958.mlab.com:13958/fool');
mongoose.Promise = global.Promise;

var app = express();

app.use(express.static(__dirname + '/../'));

var api = require('./routes/api');
var routes = require('./routes/routes');
app.use('/api', api);
// app.use('/', routes);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;
