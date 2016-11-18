var express = require('express');
var path    = require("path");
var browserify    = require("browserify-middleware");

var app = express();

browserify.settings({
  transform: [
      ['babelify', {
          presets: ["es2015", "react"]
      }]
  ]
});

app.use(express.static(__dirname));

app.get('/fool.js', browserify(__dirname + '/src/fool.js'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname) + '/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
