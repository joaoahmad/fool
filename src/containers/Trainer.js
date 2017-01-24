import React, { Component, PropTypes } from 'react';
import when from 'when';
import classnames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import Draft, { Editor, EditorState, RichUtils } from 'draft-js';
import Immutable from 'immutable';

import Fool from '../brain/Fool';
import styles from './styles.css';

const sentence = 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

function Block({ type, children }){
    return (
        <div className={styles['block-' + type]}>
            {children}
        </div>
    )
}

class Trainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            input: sentence,
            results: null,
            selectionMode: 'subjects',
            editorState: EditorState.createEmpty(),
            selections: {
                subjects: [],
                actions: [],
                terms: [],
                words: [],
            }
        }
        this.onSubmit = this.onSubmit.bind(this);
        // this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onChange = (editorState) => this.setState({editorState})
        this.onRemoveResult = this.onRemoveResult.bind(this);
        this.onSelectionMode = this.onSelectionMode.bind(this);
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
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

    // onChange(e){
    //     this.setState({ input: e.target.value });
    // }

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

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    renderSelection(target){
        const selections = this.state.selections[target];
        const classes = classnames(styles.selections__wrap, styles['selections__' + target]);
        return (
            <div className={classes}>
                <div className={styles.selections__label} onClick={this.onSelectionMode.bind(null, target)}>{target}</div>
            <div className={styles.selections__list}>
                {selections.map((item, i) => {
                    return (
                        <div className={styles.selections__item} key={i}>
                            <div className={styles.selections__item__label} onClick={this.onRemoveResult.bind(null, target, item.id)}>{item.key}</div>
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
        <div className={styles.container}>
            <p>Mode: {selectionMode}</p>
        <div className={styles.row}>
            <div className={styles.editor}>
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <Editor
                    blockStyleFn={getBlockStyle}
                    editorState={editorState}
                    placeholder="Tell a story..."
                    customStyleMap={styleMap}
                    handleKeyCommand={this.handleKeyCommand}
                    onTab={this.onTab}
                    ref="editor"
                    spellCheck={true}
                    onChange={this.onChange}
                />
            </div>
        </div>
        <pre className={styles.output}>
            {JSON.stringify(results, null, 2)}
        </pre>
    </div>
)
}
}

// Custom overrides for "code" style.
const styleMap = {
    SUBJECT: {
        backgroundColor: '#e04e9a',
        color: '#fff'
    },
    ACTION: {
        backgroundColor: '#cf66ff',
        color: '#fff'
    },
    TERM: {
        backgroundColor: '#538bff',
        color: '#fff'
    },
    WORD: {
        backgroundColor: '#68d52b',
        color: '#fff'
    },
};

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

var INLINE_STYLES = [
    {label: 'subject', style: 'SUBJECT'},
    {label: 'action', style: 'ACTION'},
    {label: 'terms', style: 'TERM'},
    {label: 'words', style: 'WORD'},
];

// 'subject': {
//     element: 'span',
//     wrapper: <Block type='subject' />
// },
// 'action': {
//     element: 'span',
//     wrapper: <Block type='action' />
// },
// 'term': {
//     element: 'span',
//     wrapper: <Block type='term' />
// },
// 'word': {
//     element: 'span',
//     wrapper: <Block type='word' />
// },

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};


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
