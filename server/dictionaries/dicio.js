var request = require('request');
var cheerio = require('cheerio');

var dicio = function(word){
    return new Promise(function(resolve){
        request('https://www.dicio.com.br/' + req.params.word, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                try {
                    var $ = cheerio.load(body);
                    var type = $('.tit-significado').next('.significado').find('.cl:first-child').html()
                    .replace('.', '');
                } catch (e) {
                    console.log('INVALID TYPE ' + req.params.word);
                    return resolve(null);
                }
                console.log('TYPE OK');

                word = new Word({
                    name: req.params.word,
                    type: type,
                });

                word.save(function(err){
                    if (err) {
                        resolve(err);
                    }
                    resolve(word);
                })
            }
        })
    });
}

module.exports = dicio;
