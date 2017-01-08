var request = require('request');
var cheerio = require('cheerio');
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
                    var regex;
                    var $ = cheerio.load(body);
                    var resultados = $('#resultados');
                    var topPanel = resultados.find('>:first-child>:first-child>:nth-child(2)');
                    // topPAnel = topPanel.remove();
                    console.log(topPanel.remove('.varpt').html());
                    // topPanel.remove('a>*:not(:first-child)');
                    var topPanelText = topPanel.text().replace(/\r?\n|\r/g, '');

                    // regex = new RegExp('pl. de ()')
                    console.log(topPanelText);
                    // console.log(topPanelText.match(/pl. de/));
                    // .replace('.', '');
                } catch (e) {
                    console.error(e);
                    return reject('Not possible to resolve: ' + word);
                }
                return resolve(body);
            }else{
                return reject(body);
            }
        })
    });
}

module.exports = priberam;
