/* eslint-disable */
var express = require('express');
var path = require("path");
var debug = require('debug')('app:server');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('../webpack.config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var compress = require('compression');
var config = require('./config');

mongoose.connect(config.mongodb.host);
mongoose.Promise = global.Promise;

const app = express();
// const server = require('http').createServer(app);
// var io = require('socket.io')(app);

// Apply gzip compression
app.use(compress())

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
const compiler = webpack(webpackConfig)

debug('Enabling webpack dev and HMR middleware')
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath  : webpackConfig.output.publicPath,
  contentBase : path.resolve(__dirname, '..', 'src'),
  hot         : true,
  quiet       : false,
  noInfo      : false,
  lazy        : false,
  stats       : {
    chunks : false,
    chunkModules : false,
    colors : true
  }
}));
app.use(require('webpack-hot-middleware')(compiler))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '..', 'public')));

var api = require('./routes/api');
app.use('/api', api);
app.use('*', function (req, res, next) {
  const filename = path.resolve(__dirname, '..', 'public', 'index.html')
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
});

// io.on('connection', function(socket){
//   console.log('Socket IO connection...');
// });

app.listen(3000)
debug(`Server is now running at http://localhost:${3000}.`)

module.exports = app;
