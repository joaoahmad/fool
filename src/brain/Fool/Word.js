import store from './store';

class Word {
  constructor(word) {
    for (var i in word)
    this[i] = word[i];
  }

  caseOf(check, callback = null) {
    let checker = false;
    console.log('data',this);
    if (Array.isArray(check)) {
      checker = !!check.filter(i => i in this.data).length;
    } else {
      checker = check in this.data;
    }
    if (checker && callback) {
      callback(this);
    }
    return !callback ? checker : this;
  }

  caseOfKey(check, callback = null) {
    let checker = false;
    if (typeof check === 'string') {
      check = [check];
    }
    checker = !!check.filter(i => {
      if (typeof i === 'object') {
        return i.key === this.key;
      }
      return i === this.key;
    }).length;
    if (checker && callback) {
      callback(this);
    }
    return !callback ? checker : this;
  }

  findByData(check, callback = null) {
    let checker = false;
    if (typeof check === 'string') {
      check = [check];
    }
    checker = store.words.find(item => {
      return item.index > this.index && !!check.find(c => item.data && item.data[c]);
    });
    return !callback ? checker : this;
  }

  get next(){
    const { index } = this;
    const next = store.words.find(w => w.index === (index + 1));
    if (next && next.data.void) {
      return next.next;
    }
    return next;
  }

  get prev(){
    const { index } = this;
    return store.words.find(w => w.index === (index - 1));
  }
}

export default Word;
