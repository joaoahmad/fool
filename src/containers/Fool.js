import React, { Component, PropTypes } from 'react';
import when from 'when';

import Fool from '../brain/Fool';
// import Brain from '../brain/Brain';

// const sentence = 'Dois suspeitos foram mortos durante uma troca de tiros na tarde desta terça feira, na localidade conhecida como Couro Come, próximo à Rua Almirante Alexandrino, em Santa Teresa, na região central do Rio. Segundo o comando da UPP Coroa/Fallet/Fogueteiro, uma viatura foi atacada pelos acusados, que estavam em uma moto, durante um patrulhamento de rotina. Houve troca de tiros e os suspeitos acabaram baleados e não resistiram.';
const sentence = 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';
const brain = new Fool(sentence);

class FoolContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            results: []
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        when(brain.start())
        .then(result => console.log('THEN', result))
    }

    onSubmit(){

    }

    render(){
        return (
            <div>
                ...
            </div>
        )
    }
}


export default FoolContainer;









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
