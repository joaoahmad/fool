import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import Trainer from './Trainer';

class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <Trainer />
      </Provider>
    );
  }
}


export default Root;
