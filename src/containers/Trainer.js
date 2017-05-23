import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import when from 'when';
import classNames from 'classnames/bind';
import map from 'lodash/map';
import AceEditor from 'react-ace';
import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';

import Fool from '../brain/Fool';
import styles from './styles.scss';
import api from '../brain/Fool/api';
import sentence from '../../data/sentence-01.txt';

const cx = classNames.bind(styles);

/** Class representing a point. */
class Trainer extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }

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
  onSubmit(data) {
    console.log(data);
    // const { input, selections } = this.state;
    // this.setState({ fetching: true });
    //
    // const promises = map(selections, (value, key) => {
    //   try {
    //     const data = JSON.parse(value);
    //     return api.post(`/${key}`, data);
    //   } catch (e) {
    //     return null;
    //   }
    // }).filter(promise => promise !== null);
    //
    // when.all(promises)
    // .then(() => {
    //   const brain = new Fool(input);
    //   when(brain.start())
    //   .then((results) => {
    //     this.setState({ results, fetching: false });
    //   });
    // });
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
    const { results, fetching, input } = this.state;
    return (
      <TrainerForm />
    );
  }
}

export default reduxForm({
  form: 'trainer',
})(Trainer);
