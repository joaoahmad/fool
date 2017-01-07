import when, { promise } from 'when';
import fn from 'when/function';
import api from './api';


//================== TRASH ==================
import dicio from './dicio';

const det = ['article', 'numeral', 'pronoun'];

function intersect(a, b){
    return a.find(i => !!b.find(j => j === i));
}

//===========================================

class Base {
    constructor() {
        this.events = {
            fetchs: [],
            searchs: [],
            analysis: [],
        }
    }

    bootstrap(){}

    /**
    * add fetch function
    */
    addFetch(callback){
        this.events.fetchs.push(callback);
    }

    /**
    * add search function
    */
    addSearch(callback){
        this.events.searchs.push(callback);
    }

    /**
    * add analysis function
    */
    addAnalyzer(callback){
        this.events.analysis.push(callback);
    }

    start(){
        const { fetchs, searchs, analysis } = this.events;

        let promise = fn.call(() => when.all(fetchs.map(f => f())));
        searchs.forEach(fn => promise = promise.then(fn));
        analysis.forEach(fn => promise = promise.then(fn));

        return promise;
    }
}

class Brain extends Base{
    constructor(input) {
        super();
        this.input = input.toLowerCase();
        this.sentences = [];
        this.database = {
            terms: [],
            subjects: [],
            actions: [],
            contextMaps: [],
        }
        this.results = {
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
        }
        this.events = {
            fetchs: [],
            searchs: [],
            analysis: [],
        }

        this.boostrap();
    }

    /**
    * start analysis
    */
    boostrap(){
        this.addFetch(this.fetchTerms.bind(this));
        this.addFetch(this.fetchSubjects.bind(this));
        this.addFetch(this.fetchActions.bind(this));

        // search's
        this.addSearch(this.searchFirstLevel.bind(this));
        this.addSearch(this.searchSecondLevel.bind(this));

        this.addAnalysis(this.analyzeSentenceSubjects.bind(this));
        this.addAnalysis(this.analyzeSentenceLocations.bind(this));

        return;

        // split's
        // .then(this.inputToSentences.bind(this))
        //
        // // search's
        // .then(this.searchFirstLevel.bind(this))
        // .then(this.searchSecondLevel.bind(this))
        //
        // // analysis
        // .then(this.analyzeSentenceSubjects.bind(this))
        // .then(this.analyzeSentenceLocations.bind(this))
        //
        // .then(this.finishAnalysis.bind(this))
    }

    /**
    * split data to sentences
    */
    inputToSentences(){
        const { terms } = this.database;
        let { input } = this;
        let regex = /\./g;
        let match;
        let head = 0;
        let tail = 0;

        // exclude terms from sentence split
        terms.forEach(term => {
            input = input.replace(term.key, 'X'.repeat(term.key.length));
        });

        // match "." and assign sentence
        while (match = regex.exec(input)) {
            tail += match.index;
            const sentence = this.input.substr(head, tail)
            .replace(/^\.|\.$/, "")
            .trim();
            head = tail;

            if (sentence) {
                this.sentences.push(new SentenceAnalyzer(sentence, this.database));
            }
        }


    }

    /**
    * fetch terms
    */
    fetchTerms(){
        return api.get('/terms')
        .then(response => this.database.terms = response);
    }

    /**
    * fetch subjects
    */
    fetchSubjects(){
        return api.get('/subjects')
        .then(response => this.database.subjects = response);
    }

    /**
    * fetch actions
    */
    fetchActions(){
        return api.get('/actions')
        .then(response => this.database.actions = response);
    }

    /**
    * search for known terms across the sentence
    */
    searchFirstLevel(){
        return 1;
    }

    /**
    * search for known words definitions across the sentence
    */
    searchSecondLevel(){

    }

    /**
    * search for known words definitions across the sentence
    */
    analyzeSentenceSubjects(){

    }

    /**
    * search for known words definitions across the sentence
    */
    analyzeSentenceLocations(){

    }

    /**
    * search for known words definitions across the sentence
    */
    analysisSentenceByLocations(){

    }

    finishAnalysis(){
        console.debug('sentences', this.sentences);
        console.debug('database', this.database);
    }
}


class SentenceAnalyzer extends Brain {
    constructor(sentence, database) {
        super(sentence);
        this.database = database;
        delete this.sentences;
        this.start();
    }
}

const sentence = 'Dois suspeitos foram mortos durante uma troca de tiros na tarde desta terça feira, na localidade conhecida como Couro Come, próximo à Rua Almirante Alexandrino, em Santa Teresa, na região central do Rio. Segundo o comando da UPP Coroa/Fallet/Fogueteiro, uma viatura foi atacada pelos acusados, que estavam em uma moto, durante um patrulhamento de rotina. Houve troca de tiros e os suspeitos acabaram baleados e não resistiram.';
// const sentence = 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';
const brain = new Brain(sentence);
brain.start();

////=====================================

class App extends Brain {
    constructor() {
        super();
    }
}


// const Ap = new Brain(sentence);
//
//
//     /**
//     * fetch terms
//     */
//     brain.addFetch(() => {
//         return api.get('/terms')
//         .then(response => this.database.terms = response);
//     };)
//
//     /**
//     * fetch subjects
//     */
//     fetchSubjects(){
//         return api.get('/subjects')
//         .then(response => this.database.subjects = response);
//     }
//
//     /**
//     * fetch actions
//     */
//     fetchActions(){
//         return api.get('/actions')
//         .then(response => this.database.actions = response);
//     }




export default Brain;
