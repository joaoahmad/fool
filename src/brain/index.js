/**
* Processo do Pensamento:
*
* 1. search de primeiro nível: por palavras
* 2. search de segudo nível: por expressões, locais e interesses (múltiplas palavras)
* 3. definicao do contexto
* 4. definicao do sujeito
* 5. ?
*/


const sentence = 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';
// const sentence = 'Durante a ação criminosa, dois ônibus foram incendiados na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';

const det = ['article', 'numeral', 'pronoun'];

function intersect(a, b){
    return a.find(i => !!b.find(j => j === i));
}


// const inArrayRecursive(toSearch, object){
//     let results = false;
//     if (typeof toSearch === 'string') {
//         toSearch = [toSearch];
//     }
//     return !!toSearch.filter(item => object[item]).length;
// }
//
// console.log(inArrayRecursive([], {
//
// }));

import dicio from './dicio';
import definitions from './definitions';

const subjects = [
    'onibus',
    'homens',
    'bandidos',
    'assaltantes',
];

const actionsSubjects = [
    'mortos',
    'incendiado',
    'incendiados',
];

const contextsMap = [
    {
        action: ['mortos', 'morte'],
        subject: ['homens', 'mulheres'],
        context: 'violence'
    }
]

function build(sentence){
    let results = [];
    sentence = sentence.toLowerCase();
    console.warn(sentence);

    // From definitions
    (() => {
        var matches = [];
        definitions.forEach(item => {
            const regex = new RegExp(item.key, 'g');
            var match;
            while (match = regex.exec(sentence)) {
                matches.push(Object.assign({}, match, { item: item }));
            }
        });
        if (matches.length) {
            // filter matches that includes then selfs
            for (var i = 0; i < matches.length; i++) {
                for (var j = 0; j < matches.length; j++) {
                    if ((matches[i] && matches[j]) && (matches[i][0] != matches[j][0] && matches[i][0].includes(matches[j][0]))) {
                        delete matches[j];
                    }
                }
            }
            matches.forEach(match => {
                var item = Object.assign({}, match.item);
                const { index } = match;
                item.sentence_index = index;
                item.type = 'definition';
                sentence = sentence.substr(0, index) + item.key.replace(/./g, 'X') + sentence.substr(index + item.key.length)
                results.push(item);
            })
        }
    })();

    // From dictionary
    (() => {
        const regex = /(?!X+)[^"\s,.]+(?:".*"\S*)?/g; // match any word (w/ special characters) not X+
        var match;
        while (match = regex.exec(sentence)) {
            let word = dicio.find(item => item.key == match[0]);
            if (word) {
                word = Object.assign({}, word);
                const { index } = match;
                word.sentence_index = index;
                word.type = 'dictionary';
                sentence = sentence.substr(0, index) + word.key.replace(/./g, 'X') + sentence.substr(index + word.key.length)
                results.push(word);
            }
        }
    })();

    results = results.sort((a,b) => a.sentence_index - b.sentence_index);
    results = results.map((word, i) => {
        const fn = Object.assign({}, word);
        if (!fn || fn.index) {
            return false;
        }
        fn.index = i;

        fn.caseOf = function(check, callback = null) {
            let checker = false;
            if (Array.isArray(check)) {
                checker = !!check.filter(i => i in this.data).length;
            }else{
                checker = check in this.data;
            }
            if (checker && callback) {
                callback(this);
            }
            return !callback ? checker : this;
        }

        fn.caseOfKey = function(check, callback = null) {
            let checker = false;
            if (typeof check === 'string') {
                check = [check];
            }
            checker = !!check.filter(i => i === this.key).length;
            if (checker && callback) {
                callback(this);
            }
            return !callback ? checker : this;
        }

        fn.findByData = function(check, callback = null) {
            let checker = false;
            if (typeof check === 'string') {
                check = [check];
            }
            checker = compiled.find(item => {
                return item.index > this.index && !!check.find(c => item.data && item.data[c]);
            });
            return !callback ? checker : this;
        }

        Object.defineProperty(fn, 'next', { get: () => {
            const next = compiled.find(w => w.index === (i + 1));
            if (next && next.data.void) {
                return next.next;
            }
            return next;
        }})

        Object.defineProperty(fn, 'prev', { get: () => {
            return compiled.find(w => w.index === (i - 1));
        }})

        return fn;
    });
    return results;
}

const compiled = build(sentence);

function Brain(){

    const results = {
        input: null,
        context: null,
        subject: null,
        location: {
            value: null,
            precision: 0
        },
        relevance: {
            value: null,
            precision: 0
        },
        reliability: {
            value: null,
            precision: 0
        },
        raw: {
            subject: [],
            action: [],
        }
    };

    function calcContext(subject, action){
        let result = null;
        contextsMap.forEach(context => {
            if (intersect(context.subject, subject) && intersect(context.action, action)) {
                result = context.context;
            }
        });
        return result;
    }

    results.input = sentence;

    let cursor;

    subjects.forEach(word => {
        const subject = compiled.find(item => item.key == word);
        if (!subject)
        return;

        results.subject = subject.key;
        results.raw.subject.push(subject.key);

        if (subject.prev) {
            subject.prev.caseOf(det, word => {
                results.subject = word.key + ' ' + results.subject;
            });
        }

        if (subject.next && subject.next.caseOf(['verb']) && subject.next.data.verb['ser']) {
            cursor = subject.next;
            results.subject += ' ' + cursor.key;
            if (cursor.next && cursor.next.caseOfKey(actionsSubjects)) {
                cursor = cursor.next;
                results.subject += ' ' + cursor.key;
                results.raw.action.push(cursor.key);
            }
        }

        const location = cursor.findByData(['location']);
        if (location && location.prev.data['prev_location']) {
            results.location.value = location.key;
            cursor = location.next;
            if (cursor && cursor.data['prev_location']) {
                while (cursor && (cursor.data['prev_location'] || cursor.data['location'])) {
                    results.location.value += ' ' + cursor.key;
                    cursor = cursor.next;
                }
            }
        }

        if (cursor) {
            // continue reading ...
        }
    });

    if (results.raw.subject.length && results.raw.action.length) {
        results.context = calcContext(results.raw.subject, results.raw.action);
    }

    return results;
}


console.debug('TARGET', Brain(sentence));

const expected = {
    input: 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.',
    context: 'violence',
    subject: 'dois homens foram mortos em avenida brasil',
    location: {
        value: 'Avenida Brasil - Penha - Sentido Centro da Cidade',
        precision: 7
    },
    relevance: {
        value: 8,
        precision: 9
    },
    reliability: {
        value: 9,
        precision: 9
    },
}

export default Brain;
