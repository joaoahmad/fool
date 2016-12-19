const sentence = 'Dois homens foram mortos';
// const sentence = 'Dois homens foram mortos na favela Morro do Adeus';

const det = ['article', 'numeral', 'pronoun'];


const data = [
    {
        key: 'dois',
        data: {
            numeral: 2
        }
    },
    {
        key: 'homens',
        data: {
            human: true,
            male: true,
            noun: true,
            plural: 'homem',
        }
    },
    {
        key: 'foram',
        data: {
            verb: {
                'ir': [
                    'plural',
                    'past'
                ],
                'ser': [
                    'plural',
                    'past'
                ],
            }
        }
    },
    {
        key: 'mortos',
        data: {
            male: true,
            verb: {
                'matar': [
                    'plural',
                    'past'
                ],
                'morrer': [
                    'plural',
                    'past'
                ],
                'morto': [
                    'plural',
                    'present'
                ],
            }
        }
    },
];

function build(sentence){
    return sentence
    .split(' ')
    .map((word, i) => {
        const fn = find(word);
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

        Object.defineProperty(fn, 'next', { get: () => {
            return compiled.find(w => w.index === (i + 1));
        }})

        Object.defineProperty(fn, 'previous', { get: () => {
            return compiled.find(w => w.index === (i - 1));
        }})

        return fn;
    });
}

function find(word){
    return data.filter(item => item.key == word.toLowerCase())[0];
}

const compiled = build(sentence);

function Brain(){
    const thinking = [];
    const results = {
        source: null,
        context: null,
        subject: null,
        location: [0,0],
        relevance: [0,0],
        reliability: [0,0],
    };

    compiled.forEach(word => {
        word.caseOf(det, word => {
            if (word.next.caseOf(['noun'])) {
                word =
            }
        });

        word.caseOf(det, word => {
            if (word.next.caseOf(['noun'])) {
                word =
            }
        });

    });

}


const hey = [
    'dois homens',
    'foram',
    'mortos'
]

console.debug('TARGET', Brain(sentence));

const target = {
    source: 'Dois homens foram mortos',
    context: 'death',
    subject: '2 humans were killed',
    location: null,
    location_precision: null,
    relevance: null,
    relevance_precision: null,
    reliability: null,
    reliability_precision: null,
}

export default Brain;
