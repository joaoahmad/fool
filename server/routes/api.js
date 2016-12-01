var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio')

var mongoose = require('mongoose');
var Word = require('../models/word');

router.route('/word/:word')
.get(function(req, res){
    Word.findOne({ name: req.params.word },function(err, word) {
        if(!word){

            request('https://www.dicio.com.br/' + req.params.word, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    try {
                        var $ = cheerio.load(body);
                        var type = $('.tit-significado').next('.significado').find('.cl:first-child').html()
                        .replace('.', '');
                    } catch (e) {
                        console.log('INVALID TYPE ' + req.params.word);
                        return res.send(null);
                    }
                    console.log('TYPE OK');

                    word = new Word({
                        name: req.params.word,
                        type: type,
                    });

                    word.save(function(err){
                        if (err) {
                            res.send(err);
                        }
                        res.json(word);
                    })
                }
            })
        }else{
            res.json(word);
        }
    })

    // return res.json(req.params.word);
});

module.exports = router;
