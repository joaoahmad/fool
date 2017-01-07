'use strict';

var mongoose = require('mongoose');
var Action = require('../../models/action');

module.exports.add = function(req, res) {
    var action = new Action(req.body);
    action.save(function(err) {
        if (err)
        res.send(err);

        res.json(action);
    });
};

module.exports.get = function(req, res) {
    Action.find(function(err, actions) {
        if (err)
        res.send(err);

        res.json(actions);
    });
};
