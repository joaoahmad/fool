'use strict';

import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import configureStore from './stores';
import Root from './containers/Root';

const store = configureStore();
render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('root')
)
