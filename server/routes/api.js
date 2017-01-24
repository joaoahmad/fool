var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var terms = require('./api/terms');
var subjects = require('./api/subjects');
var actions = require('./api/actions');
var contextMaps = require('./api/contextMaps');
var words = require('./api/words');

router.route('/terms')
.get(function(req, res){ terms.get(req, res) })
.post(function(req, res){ terms.add(req, res) });

router.route('/subjects')
.get(function(req, res){ subjects.get(req, res) })
.post(function(req, res){ subjects.add(req, res) });

router.route('/actions')
.get(function(req, res){ actions.get(req, res) })
.post(function(req, res){ actions.add(req, res) });

router.route('/context-maps')
.get(function(req, res){ contextMaps.get(req, res) })
.post(function(req, res){ contextMaps.add(req, res) });

router.route('/words')
.get(function(req, res){ words.get(req, res) });

router.route('/words/:word')
.post(function(req, res){ words.add(req, res) });
module.exports = router;
