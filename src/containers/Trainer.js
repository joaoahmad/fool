import React, { Component } from 'react';
import when from 'when';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames/bind';
import Fool from '../brain/Fool';
import styles from './styles.scss';
import sentence from '../../data/sentence-01.txt';

const cx = classNames.bind(styles);

/** Class representing a point. */
class Trainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      input: sentence,
      results: null,
      selectionMode: 'subjects',
      selections: {
        subjects: [],
        actions: [],
        terms: [],
        words: [],
      },
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectionMode = this.onSelectionMode.bind(this);
  }

  componentDidMount() {

  }

  /**
  * Handle form submit
  * @return void
  */
  onSubmit() {
    const { input } = this.state;
    const brain = new Fool(input);
    when(brain.start())
    .then((results) => {
      this.setState({ results });
    });
  }

  /**
   * onChange - description
   *
   * @param  {Event} e
   * @return void
   */
  onChange(e) {
    this.setState({ input: e.target.value });
  }

  onSelect(e) {
    const { selectionMode, selections } = this.state;
    const target = selectionMode;

    const start = e.target.selectionStart;
    const finish = e.target.selectionEnd;
    const selection = e.target.value.substring(start, finish);
    if (!selection) return;

    const newState = Object.assign({}, selections);
    newState[target].push({
      key: selection.trim(),
      id: uniqueId(),
    });
    this.setState({ selections: newState });
  }

  onSelectionMode(target) {
    this.setState({ selectionMode: target });
  }

  onRemoveResult(target, id) {
    const { selections } = this.state;
    const newState = Object.assign({}, selections);
    newState[target] = newState[target].filter(item => item.id !== id);
    this.setState({ selections: newState });
  }

  render() {
    const { results, selectionMode } = this.state;
    return (
      <div className={cx('container')}>
        <p>Mode: {selectionMode}</p>
        <div className={cx('row')}>
          <div className={cx('input')}>
            <textarea onChange={this.onChange} className={cx('textarea')} defaultValue={sentence} />
            <button onClick={this.onSubmit} className={cx('button')}>Analisar</button>
          </div>
          <div className={cx('input')}>
            hey
          </div>
        </div>
        <pre className={cx('output')}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    );
  }
}

export default Trainer;
