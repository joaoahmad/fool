'use strict';

var mongoose = require('mongoose');
var ContextMap = require('../../models/contextMap');

module.exports.add = function(req, res) {
    var contextMap = new ContextMap(req.body);
    contextMap.save(function(err) {
        if (err)
        res.send(err);

        res.json(contextMap);
    });
};

module.exports.get = function(req, res) {
    ContextMap.find(function(err, contextMaps) {
        if (err)
        res.send(err);

        res.json(contextMaps);
    });
};
