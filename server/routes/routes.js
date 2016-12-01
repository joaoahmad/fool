var express = require('express');
var http = require('http');
var router = express.Router();

router.get('', function(req, res) {
    res.sendFile(path.join(__dirname) + '/index.html');
});

router.get('*', function(req, res) {
     res.status(404).send(null);
});

module.exports = router;
