import React from 'react';
import ReactDOM from 'react-dom';
import Fool from './fool';
import axios from 'axios';

axios.get('/data/article-01.txt')
.then(({ data }) => {
    const results = new Fool(data);
    console.debug('RESULTS', results);
    ReactDOM.render(<div>{'hey'}</div>,document.getElementById('root'));
});
