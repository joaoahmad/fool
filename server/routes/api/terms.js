'use strict';

var mongoose = require('mongoose');
var Term = require('../../models/term');

module.exports.add = function(req, res) {
    var term = new Term(req.body);
    term.save(function(err) {
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
