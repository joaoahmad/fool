'use strict';

var mongoose = require('mongoose');
var Subject = require('../../models/subject');

module.exports.add = function(req, res) {
  Subject.finOne({ key: req.body.key }, function(err, subject){
    if (!subject) {
      var subject = new Subject(req.body);
      subject.save(function(err) {
        if (err)
        res.send(err);

        res.json(subject);
      });
    }else{
      res.json(subject);
    }
  })
};

module.exports.get = function(req, res) {
  Subject.find(function(err, subjects) {
    if (err)
    res.send(err);

    res.json(subjects);
  });
};
