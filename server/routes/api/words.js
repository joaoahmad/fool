'use strict';

var mongoose = require('mongoose');
var Word = require('../../models/word');
var priberam = require('../../dictionaries/priberam')

module.exports.add = function(req, res) {
    Word.findOne({ key: req.params.word },function(err, word) {
        if(!word){
            priberam(req.params.word)
            .then(function(result){
                word = new Word(result);
                word.save(function(err){
                    if (err) {
                        res.json({ err });
                    }
                    res.json(word);
                })

            }, function(err){
                res.send({
                    error: err
                });
            })
        }else{
            res.json(word);
        }
    })
};

module.exports.get = function(req, res) {
    Word.find(function(err, words) {
        if (err)
        res.send(err);

        res.json(words);
    });
};
