import when from 'when';
import fn from 'when/function';
import get from 'lodash/get';
import api from './api';
import store from './store';
import { intersect } from './helpers';
import FoolBase from './FoolBase';
import Word from './Word';

const det = ['article', 'numeral', 'pronoun'];

class SentenceAnalyzer extends FoolBase {
  constructor(sentence) {
    super(sentence);
    this.sentence = sentence;
    this.words = [];
  }

  start() {
    // search's
    return fn.call(this.searchFirstLevel.bind(this))
    .then(this.searchSecondLevel.bind(this))

    // build
    .then(this.buildWords.bind(this))

    // analysis
    .then(this.analyzeSentenceSubjects.bind(this))
    .then(this.analyzeSentenceLocations.bind(this))
    .then(this.analyzeSentenceContext.bind(this))

    .then(this.finishAnalysis.bind(this));
  }

  /**
  * search for known TERMS across the sentence
  */
  searchFirstLevel() {
    const { terms } = store;
    const matches = [];

    terms.forEach((item) => {
      const regex = new RegExp(item.key, 'g');
      let match;

      // eslint-disable-next-line
      while (match = regex.exec(this.sentence)) {
        matches.push(Object.assign({}, match, { item }));
      }
    });

    if (matches.length) {
      // filter matches that includes then selfs
      for (let i = 0; i < matches.length; i += 1) {
        for (let j = 0; j < matches.length; j += 1) {
          // eslint-disable-next-line
          if ((matches[i] && matches[j]) && (matches[i][0] !== matches[j][0] && matches[i][0].includes(matches[j][0]))) {
            delete matches[j];
          }
        }
      }

      matches.forEach((match) => {
        const item = Object.assign({}, match.item);
        const { index } = match;
        item.sentence_index = index;
        item.type = 'definition';
        this.sentence = this.sentence.substr(0, index) + 'X'.repeat(item.key.length) + this.sentence.substr(index + item.key.length);
        this.words.push(item);
      });
    }
  }

  /**
  * search for known WORDS definitions across the sentence
  */
  searchSecondLevel() {
    const regex = /(?!X+)[^"\s,.]+(?:".*"\S*)?/g; // match any word (w/ special characters) not X+
    let regexMatch;
    const promises = [];
    // eslint-disable-next-line
    while (regexMatch = regex.exec(this.sentence)) {
      const match = regexMatch;
      let word = store.words.find(item => item.key === match[0]);

      if (!word) {
        const promise = api.post(`/words/${match[0]}`)
        .then((response) => {
          word = Object.assign({}, response);
          const { index } = match;
          word.sentence_index = index;
          word.type = 'dictionary';
          this.sentence = this.sentence.substr(0, index) + word.key.replace(/./g, 'X') + this.sentence.substr(index + word.key.length);
          this.words.push(word);
        });
        promises.push(promise);
      } else {
        word = Object.assign({}, word);
        const { index } = match;
        word.sentence_index = index;
        word.type = 'dictionary';
        this.sentence = this.sentence.substr(0, index) + word.key.replace(/./g, 'X') + this.sentence.substr(index + word.key.length);
        this.words.push(word);
      }
    }
    return when.all(promises);
  }

  /**
  * sort and assign words to Word Class
  */
  buildWords() {
    store.words = this.words
    .sort((a, b) => a.sentence_index - b.sentence_index)
    .map((item, i) => {
      const word = Object.assign({}, item);
      word.index = i;
      return new Word(word);
    });
  }

  /**
  * search for known words definitions across the sentence
  */
  analyzeSentenceSubjects() {
    const { subjects } = store;

    subjects.forEach((subject) => {
      let cursor = store.words.find(item => item.key === subject.key);
      if (!cursor) return;

      this.results.subject = cursor.key;
      this.results.raw.subject.push(cursor.key);

      if (cursor.prev) {
        cursor.prev.caseOf(det, (word) => {
          this.results.subject = `${word.key} ${this.results.subject}`;
        });
      }

      if (cursor.next && cursor.next.caseOf(['verb']) && get(cursor.next, 'sdata.verb.ser')) {
        cursor = cursor.next;
        this.results.subject += ` ${cursor.key}`;
        if (cursor.next && cursor.next.caseOfKey(store.actions)) {
          cursor = cursor.next;
          this.results.subject += ` ${cursor.key}`;
          this.results.raw.action.push(cursor.key);
        }
      }

      const location = cursor.findByData(['location']);
      if (location) {
        this.results.location.value = location.key;
        cursor = location.next;
        if (cursor && get(cursor, 'data.prev_location')) {
          while (cursor && (get(cursor, 'data.prev_location') || get(cursor, 'data.location'))) {
            this.results.location.value += ` ${cursor.key}`;
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
  analyzeSentenceLocations() {

  }

  /**
  * search for known words definitions across the sentence
  */
  analyzeSentenceContext() {
    const { raw } = this.results;
    if (raw.subject.length && raw.action.length) {
      store.contextMaps.forEach((context) => {
        if (intersect(context.subject, raw.subject) && intersect(context.action, raw.action)) {
          this.results.context = context.context;
        }
      });
    }
  }

  /**
  * search for known words definitions across the sentence
  */
  analysisSentenceByLocations() {

  }

  finishAnalysis() {
    this.results.input = this.input;
    console.warn('result', this.results);
    return this.results;
  }
}

export default SentenceAnalyzer;
