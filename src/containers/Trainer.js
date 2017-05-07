import React, { Component, PropTypes } from 'react';
import when from 'when';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames/bind';

import Fool from '../brain/Fool';
import styles from './styles.scss';
const cx = classNames.bind(styles);

// const sentence = 'Em entrevista ao EXTRA, Klayne afirmou que os próprios traficantes a socorreram e que ela pediu para não ser morta.';
// const sentence = 'suspeito de envolvimento com a morte da menina Sofia Lara Braga, de 2 anos.';
const sentence = 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';

class Trainer extends Component{
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
            }
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onSelectionMode = this.onSelectionMode.bind(this);
    }

    componentDidMount(){

    }

    onSubmit(){
        const { input, fetching, results } = this.state;
        const brain = new Fool(input);
        when(brain.start())
        .then(results => {
            this.setState({ results });
        })
    }

    onChange(e){
        this.setState({ input: e.target.value });
    }

    onSelect(e){
        const { selectionMode, selections } = this.state;
        const target = selectionMode;

        const start = e.target.selectionStart;
        const finish = e.target.selectionEnd;
        const selection = e.target.value.substring(start, finish);
        if (!selection)
        return;

        // const newState = {
        //     ...selections
        // }

        const newState = Object.assign({}, selections);
        newState[target].push({
            key: selection.trim(),
            id: uniqueId()
        });
        this.setState({ selections: newState });
    }

    onSelectionMode(target){
        this.setState({ selectionMode: target });
    }

    onRemoveResult(target, id){
        const { selections } = this.state;
        const newState = Object.assign({}, selections);
        newState[target] = newState[target].filter(item => item.id !== id);
        this.setState({ selections: newState });
    }


    renderSelection(target){
        const selections = this.state.selections[target];
        return (
            <div className={cx('selections__wrap', 'selections__' + target)}>
                <div className={cx('selections__label')} onClick={this.onSelectionMode.bind(null, target)}>{target}</div>
            <div className={cx('selections__list')}>
                {selections.map((item, i) => {
                    return (
                        <div className={cx('selections__item')} key={i}>
                            <div className={cx('selections__item__label')} onClick={this.onRemoveResult.bind(null, target, item.id)}>{item.key}</div>
                        {/*<div className={styles.selections__item__action}>remover</div>*/}
                    </div>
                )
            })}
        </div>
    </div>
)
}

render(){
    const { input, fetching, results, selectionMode, editorState } = this.state;


    return (
        <div className={cx('container')}>
            <p>Mode: {selectionMode}</p>
        <div className={cx('row')}>
            <div className={cx('input')}>
                <textarea onChange={this.onChange} className={cx('textarea')} defaultValue={sentence}></textarea>
            <button onClick={this.onSubmit} className={cx('button')}>Analisar</button>
            </div>
            <div className={cx('input')}>
                {this.renderSelection('subjects')}
            </div>
        </div>
        <pre className={cx('output')}>
            {JSON.stringify(results, null, 2)}
        </pre>
    </div>
)
}
}

export default Trainer;









// import React from 'react';
// import axios from 'axios';
// import when from 'when';
// // var DicionarioAberto = require('dicionario-aberto')();
// // import map from 'lodash';
//
// const keywords = [
//     'tiro',
//     'tiroteio',
//     'assalto',
//     'morte',
//     'morto',
//     'mortos',
//     'violência',
//     'suspeitos',
//     'baleados',
//     'resistiram'
// ];
//
// function Fool(data){
//     this.data = String(data);
//     this.steps = [];
//     this.interest = null;
//
//     this.step('SENTENCES', () => {
//         const regex = `(.*?(?:${keywords.join('|')}).*?)\\.`;
//         return this.match(regex)[0]
//     });
//
//     this.step('FRAGMENTS', () => {
//         if (this.interest) {
//             this.interest = this.interest
//             .split('.')
//             .map(sentence => {
//                 return sentence
//                 .split(' ')
//                 .map(i => i.replace(/[^a-zA-Z0-9]/, ''))
//                 .map(i => i.toLowerCase())
//                 .filter(i => i != '');
//             })
//             .filter(item => item != '')
//             console.log(this.interest);
//
//             when.all(this.interest
//             .map(sentence => sentence.map(word => this.recordWord(word))))
//             .then(res => console.log('THEN', res))
//         }
//     });
//
//     this.run();
//     return this.interest;
// }
//
// Fool.prototype.match = function(exp){
//     if (!exp instanceof RegExp)
//     exp = new RegExp(exp, 'g');
//
//     return this.data.match(exp);
// }
//
// Fool.prototype.step = function(name, callback){
//     this.steps.push(callback.bind(this))
// }
//
// Fool.prototype.recordWord = function(word){
//     return axios.get('/api/word/' + word)
//     .the;
//     // localStorage.setItem(word)
// }
//
// Fool.prototype.run = function(callback){
//     this.steps.forEach(step => this.interest = step())
// }
//
// var expected = {
//     context: 'shooting',
//     date: '2016-11-15',
//     veracity: 10,
//     danger: 10,
//     location: {
//         address: 'Rua Almirante Alexandrino - Santa Teresa, Rio de Janeiro - RJ',
//         precision: 'near',
//     },
//     better: {
//
//     },
//     raw: 'Dois suspeitos foram mortos durante uma troca de tiros na tarde desta terça feira, na localidade conhecida como Couro Come, próximo à Rua Almirante Alexandrino, em Santa Teresa, na região central do Rio.'
// }
//
//
// export default Fool;
