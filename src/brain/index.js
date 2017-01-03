/**
* Processo do Pensamento:
*
* 1. search de primeiro nível: por palavras
* 2. search de segudo nível: por expressões, locais e interesses (múltiplas palavras)
* 3. definicao do contexto
* 4. definicao do sujeito
* 5. ?
*/


const sentence = 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, Avenida Brasil, na pista em direção ao Centro da cidade.';
// const sentence = 'Durante a ação criminosa, dois ônibus foram incendiados na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';

const det = ['article', 'numeral', 'pronoun'];


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

function build(sentence){
    const results = [];
    const defsMap = definitions.reduce((result, item) => {
        const index = sentence.toLowerCase().indexOf(item.key);
        console.log('index', index, item.key);
        if (index) {
            item.sentence_index = index;
            // sentence = sentence.substr(0, index) +  + sentence.substr(0, item.key.length)
            result.push(item);
        }
        return result;
    }, []);



    console.debug('HEY', defsMap, sentence);

    let words = sentence
    .replace(/[,.]/, '')
    .split(' ')
    .map((word, i) => find(word));

    console.log(words);
    words = words.map((word, i) => {
        const fn = find(word);
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
            console.debug('conpiled', compiled);
            checker = compiled.find(item => {
                return item.index > this.index && !!check.find(c => item.data && item.data[c]);
            });

            console.log(checker);

            return checker;
            checker = !!check.filter(i => i === this.key).length;
            if (checker && callback) {
                callback(this);
            }
            return !callback ? checker : this;
        }

        Object.defineProperty(fn, 'next', { get: () => {
            const next = compiled.find(w => w.index === (i + 1));
            if (next.data.prev_location || next.data.void) {
                return next.next;
            }
            return next;
        }})

        Object.defineProperty(fn, 'prev', { get: () => {
            return compiled.find(w => w.index === (i - 1));
        }})

        return fn;
    });
    return words;
}

function find(word){
    return dicio.find(item => item.key == word.toLowerCase());
}

const compiled = build(sentence);

function Brain(){

    const results = {
        source: null,
        context: null,
        subject: null,
        location: [0,0],
        relevance: [0,0],
        reliability: [0,0],
    };

    let cursor;

    subjects.forEach(word => {
        const subject = compiled.find(item => item.key == word);
        if (!subject)
        return;

        if (subject.prev) {
            subject.prev.caseOf(det, word => {
                results.subject = [word.key, subject.key].join(' ');
            });
        }

        if (subject.next && subject.next.caseOf(['verb']) && subject.next.data.verb['ser']) {
            cursor = subject.next;
            results.subject += ' ' + cursor.key;
            if (cursor.next && cursor.next.caseOfKey(actionsSubjects)) {
                cursor = cursor.next;
                results.subject += ' ' + cursor.key;
            }
        }

        console.log('location', cursor.findByData(['location']));

        // console.log(results);
    });

    // compiled.forEach(word => {
    //     word.caseOf(det, word => {
    //         if (word.next.caseOf(['noun'])) {
    //             // word =
    //         }
    //     });
    //
    //     word.caseOf(det, word => {
    //         if (word.next.caseOf(['noun'])) {
    //             // word =
    //         }
    //     });
    //
    // });

}


console.debug('TARGET', Brain(sentence));

const expected = {
    source: 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.',
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
