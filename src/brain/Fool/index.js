import when, { promise } from 'when';
import fn from 'when/function';
import api from './api';
import store from './store';
import FoolBase from './FoolBase';
import SentenceAnalyzer from './SentenceAnalyzer';

//===========================================

class Fool extends FoolBase {
    constructor(input) {
        super(input);
        this.sentences = [];
    }

    /**
    * start analysis
    */
    start(){
        return fn.call(() => when.all([
            this.fetchTerms(),
            this.fetchSubjects(),
            this.fetchActions(),
        ]))
        .then(this.splitToSentences.bind(this))
        .then(this.analysisSentences.bind(this))
        .then(this.finishAnalysis.bind(this))
    }

    /**
    * split data to sentences
    */
    splitToSentences(){
        let { input } = this;
        let regex = /\./g;
        let match;
        let head = 0;
        let tail = 0;

        store.terms.forEach(term => {
            input = input.replace(term.key, 'X'.repeat(term.key.length));
        });

        while (match = regex.exec(input)) {
            tail += match.index;
            const sentence = this.input.substr(head, tail)
            .replace(/^\.|\.$/, "")
            .trim();
            head = tail;

            if (sentence) {
                this.sentences.push(new SentenceAnalyzer(sentence));
            }
        }
    }

    /**
    * fetch terms
    */
    fetchTerms(){
        return api.get('/terms')
        .then(response => store.terms = response);
    }

    /**
    * fetch subjects
    */
    fetchSubjects(){
        return api.get('/subjects')
        .then(response => store.subjects = response);
    }

    /**
    * fetch actions
    */
    fetchActions(){
        return api.get('/actions')
        .then(response => store.actions = response);
    }

    /**
    * analysis sentences
    */
    analysisSentences(){
        return when.all(this.sentences.map(f => f.start()));
    }

    /**
    * finish analysis
    */
    finishAnalysis(){
        this.results = this.sentences[0].results;
        return this.results;
    }
}

export default Fool;
