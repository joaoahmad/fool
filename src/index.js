/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
// import RedBox from 'redbox-react';
import { Provider } from 'react-redux';
import configureStore from './stores';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';

const store = configureStore();

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  ReactDOM.render((
    <AppContainer>
      <Root />
    </AppContainer>
  ), MOUNT_NODE);
};

if (module.hot) {
  // Development render functions
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react').default

    ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
  }

  // Wrap render in try/catch
  render = () => {
    try {
      renderApp()
    } catch (error) {
      console.error(error)
      renderError(error)
    }
  }

  // Setup hot module replacement
  module.hot.accept('./containers/Root', () => {
    require('./containers/Root');
    render();
  });
}


// ========================================================
// Go!
// ========================================================
render();
