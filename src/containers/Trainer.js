import React, { Component } from 'react';
import when from 'when';
import classNames from 'classnames/bind';
import map from 'lodash/map';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';

import Fool from '../brain/Fool';
import styles from './styles.scss';
import api from '../brain/Fool/api';
import sentence from '../../data/sentence-02.txt';

const cx = classNames.bind(styles);

/** Class representing a point. */
class Trainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      input: sentence,
      results: null,
      selections: {
        subjects: '',
        actions: '',
        terms: '',
        // words: '',
      },
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
  }

  /**
  * Handle form submit
  * @return void
  */
  onSubmit() {
    const { input, selections } = this.state;
    this.setState({ fetching: true });

    const promises = map(selections, (value, key) => {
      try {
        const data = JSON.parse(value);
        return api.post(`/${key}`, data);
      } catch (e) {
        return null;
      }
    }).filter(promise => promise !== null);

    when.all(promises)
    .then(() => {
      const brain = new Fool(input);
      when(brain.start())
      .then((results) => {
        this.setState({ results, fetching: false });
      });
    });
  }

  /**
  * Handle textarea change
  * @return void
  */
  onChange(e) {
    this.setState({ input: e.target.value });
  }

  /**
  * Handle textarea change
  * @return void
  */
  onDataChange(value, name) {
    const { selections } = this.state;
    selections[name] = value;
    this.setState({ selections });
  }

  onRemoveResult(target, id) {
    const { selections } = this.state;
    const newState = Object.assign({}, selections);
    newState[target] = newState[target].filter(item => item.id !== id);
    this.setState({ selections: newState });
  }

  render() {
    const { results, fetching, input, selections: { subjects, actions, terms } } = this.state;
    const defaultValue = '{ "key": "" }';
    const editorProps = {
      height: '100px',
      width: '100%',
    };
    return (
      <div className={cx('container')}>
        <div className={cx('row')}>
          <textarea
            onChange={this.onChange}
            className={cx('textarea')}
            value={input}
          />
        </div>
        <div className={cx('selections')}>
          <div className={cx('row row--vertical')}>
            <div>Subjects</div>
            <AceEditor
              mode='javascript'
              onChange={e => this.onDataChange(e, 'subjects')}
              value={subjects}
              {...editorProps}
            />
          </div>
          <div className={cx('row row--vertical')}>
            <div>Actions</div>
            <AceEditor
              mode='javascript'
              onChange={e => this.onDataChange(e, 'actions')}
              value={actions}
              {...editorProps}
            />
          </div>
          <div className={cx('row row--vertical')}>
            <div>Terms</div>
            <AceEditor
              mode='javascript'
              onChange={e => this.onDataChange(e, 'terms')}
              value={terms}
              {...editorProps}
            />
          </div>
          <button onClick={this.onSubmit} className={cx('button')} disabled={fetching}>
            {!fetching ? 'Analisar' : 'Loading...'}
          </button>
        </div>
        <pre className={cx('output')}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    );
  }
}

export default Trainer;
