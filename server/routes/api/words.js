'use strict';

var mongoose = require('mongoose');
var Word = require('../../models/word');
var priberam = require('../../dictionaries/priberam')

module.exports.get = function(req, res) {
    Word.findOne({ name: req.params.word },function(err, word) {
        if(!word){
            priberam(req.params.word)
            .then(function(response){
                // console.log(response);

                // word = new Word({
                //     name: response,
                //     type: '',
                // });

                // word.save(function(err){
                //     if (err) {
                //         reject(err);
                //     }
                //     return resolve(word);
                // })

                res.send(response);
            }, function(err){
                res.send(err);
                // res.json({ err });
            })
        }else{
            res.json(word);
        }
    })
};
