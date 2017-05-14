var request = require('request');
var cheerio = require('cheerio');
var porExtenso = require('../porExtenso');
// 'https://www.priberam.pt/DLPO/' + word
var priberam = function(word){
    var options = {
        url: 'https://www.priberam.pt/DLPO/' + word,
        headers: {
            'User-Agent': 'request'
        }
    };

    return new Promise(function(resolve, reject){
        request(options, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode == 200) {

                try {
                    var result = {
                        key: word,
                        data: {}
                    };
                    var regex;
                    var $ = cheerio.load(body);
                    var resultados = $('#resultados');
                    var topPanel = resultados.find('>:first-child>:first-child>:nth-child(2)');
                    // topPAnel = topPanel.remove();
                    // console.log(topPanel.remove('.varpt').html());
                    // topPanel.remove('a>*:not(:first-child)');
                    var topPanelText = topPanel.text().replace(/\r?\n|\r/g, '');
                    var descriptions = resultados.find('Categoria_ext_aAO');
                    descriptions = descriptions.each(function(i, element){
                        element = $(element);
                        var string = element.html().toLowerCase();
                        var title = element.parents('.varpt')
                        .parent()
                        .find('> .varpb > span')
                        .text()
                        .toLowerCase()
                        .replace(/[^a-z]/, '');

                        if (string.indexOf('substantivo') !== -1) {
                            result.data.noun = true;
                        }
                        if (string.indexOf('verbo') !== -1) {
                            if (!result.data.verb) {
                                result.data.verb = {};
                            }
                            result.data.verb[title] = true;
                        }
                        if (string.indexOf('adjetivo') !== -1) {
                            if (!result.data.adjective) {
                                result.data.adjective = {};
                            }
                            result.data.adjective[title] = true;
                        }
                        if (string.indexOf('numeral') !== -1) {
                            var number = porExtenso.resolve(title);
                            result.data.numeral = number || true;
                        }
                        if (string.indexOf('pronome') !== -1) {
                            result.data.pronoun = true;
                        }
                        if (string.indexOf('feminino') !== -1) {
                            result.data.female = true;
                        }
                        if (string.indexOf('masculino') !== -1) {
                            result.data.male = true;
                        }
                    });

                    // regex = new RegExp('pl. de ()')
                    // console.log(topPanelText);
                    // console.log(topPanelText.match(/pl. de/));
                    // .replace('.', '');
                } catch (e) {
                    console.error(e);
                    return reject('Not possible to resolve: ' + word);
                }
                return resolve(result);
            }else{
                return reject('Status Code: ' + response.statusCode);
            }
        })
    });
}

module.exports = priberam;
