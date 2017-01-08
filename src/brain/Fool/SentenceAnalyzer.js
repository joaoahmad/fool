import when, { promise } from 'when';
import fn from 'when/function';
import api from './api';
import store from './store';
import { intersect } from './helpers';
import FoolBase from './FoolBase';
import Word from './Word';
import dicio from './_dicio';

const det = ['article', 'numeral', 'pronoun'];

class SentenceAnalyzer extends FoolBase {
    constructor(sentence) {
        super(sentence);
        this.sentence = sentence;
        this.words = [];
        delete this.sentences;
    }

    start(){
        // search's
        return fn.call(this.searchFirstLevel.bind(this))
        .then(this.searchSecondLevel.bind(this))

        //build
        .then(this.buildWords.bind(this))

        // analysis
        .then(this.analyzeSentenceSubjects.bind(this))
        .then(this.analyzeSentenceLocations.bind(this))
        .then(this.analyzeSentenceContext.bind(this))

        .then(this.finishAnalysis.bind(this))
    }

    /**
    * search for known terms across the sentence
    */
    searchFirstLevel(){
        const { terms } = store;
        let matches = [];

        terms.forEach(item => {
            const regex = new RegExp(item.key, 'g');
            var match;

            while (match = regex.exec(this.sentence))
            matches.push(Object.assign({}, match, { item: item }));
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
                this.sentence = this.sentence.substr(0, index) + 'X'.repeat(item.key.length) + this.sentence.substr(index + item.key.length)
                this.words.push(item);
            })
        }
    }

    /**
    * search for known words definitions across the sentence
    */
    searchSecondLevel(){
        const regex = /(?!X+)[^"\s,.]+(?:".*"\S*)?/g; // match any word (w/ special characters) not X+
        let match;
        while (match = regex.exec(this.sentence)) {
            let word = dicio.find(item => item.key == match[0]);
            if (word) {
                word = Object.assign({}, word);
                const { index } = match;
                word.sentence_index = index;
                word.type = 'dictionary';
                this.sentence = this.sentence.substr(0, index) + word.key.replace(/./g, 'X') + this.sentence.substr(index + word.key.length)
                this.words.push(word);
            }
        }
    }

    /**
    * sort and assign words to Word Class
    */
    buildWords(){
        store.words = this.words
        .sort((a,b) => a.sentence_index - b.sentence_index)
        .map((word, i) => {
            word.index = i;
            return new Word(word);
        });
    }

    /**
    * search for known words definitions across the sentence
    */
    analyzeSentenceSubjects(){
        const { subjects } = store;

        subjects.forEach(subject => {
            let cursor = store.words.find(item => item.key == subject.key);
            console.log('SUBJECT', subject, cursor, store);
            if (!cursor)
            return;

            this.results.subject = cursor.key;
            this.results.raw.subject.push(cursor.key);

            if (cursor.prev) {
                cursor.prev.caseOf(det, word => {
                    this.results.subject = word.key + ' ' + this.results.subject;
                });
            }

            if (cursor.next && cursor.next.caseOf(['verb']) && cursor.next.data.verb['ser']) {
                cursor = cursor.next;
                this.results.subject += ' ' + cursor.key;
                if (cursor.next && cursor.next.caseOfKey(store.actions)) {
                    cursor = cursor.next;
                    this.results.subject += ' ' + cursor.key;
                    this.results.raw.action.push(cursor.key);
                }
            }

            const location = cursor.findByData(['location']);
            if (location && location.prev.data['prev_location']) {
                this.results.location.value = location.key;
                cursor = location.next;
                if (cursor && cursor.data['prev_location']) {
                    while (cursor && (cursor.data['prev_location'] || cursor.data['location'])) {
                        this.results.location.value += ' ' + cursor.key;
                        cursor = cursor.next;
                    }
                }
            }

            if (cursor) {
                // continue reading ...
            }
        });
    }

    /**
    * search for known words definitions across the sentence
    */
    analyzeSentenceLocations(){

    }

    /**
    * search for known words definitions across the sentence
    */
    analyzeSentenceContext(){
        const { raw } = this.results;
        if (raw.subject.length && raw.action.length) {
            store.contextMaps.forEach(context => {
               if (intersect(context.subject, raw.subject) && intersect(context.action, raw.action)) {
                   this.results.context = context.context;
               }
           });
        }
    }

    /**
    * search for known words definitions across the sentence
    */
    analysisSentenceByLocations(){

    }

    finishAnalysis(){
        this.results.input = this.input;
        return this.results;
    }
}

export default SentenceAnalyzer;
