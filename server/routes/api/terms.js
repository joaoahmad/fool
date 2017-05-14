'use strict';

var mongoose = require('mongoose');
var Term = require('../../models/term');

module.exports.add = function(req, res) {
    Term.findOneOrCreate({ key: req.body.key }, req.body, function(err, term) {
        if (err)
        res.send(err);

        res.json(term);
    });
};

module.exports.get = function(req, res) {
    Term.find(function(err, terms) {
        if (err)
        res.send(err);

        res.json(terms);
    });
};
