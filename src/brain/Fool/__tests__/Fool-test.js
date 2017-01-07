import Brain from '../Brain';
import BrainOld from '../index';
const sentence = 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';

describe('Brain', () => {
    it('initialize sentence analysis', () => {
        const brain = new Brain(sentence);
        brain.start();

        const expected = {
            input: 'dois homens foram mortos na avenida brasil, na altura da penha, na pista em direção ao centro da cidade.',
            context: 'violence',
            subject: 'dois homens foram mortos',
            location: {
                value: 'avenida brasil na altura da penha na pista em direção ao centro da cidade',
                precision: 0
            },
            relevance: {
                value: null,
                precision: 0
            },
            reliability: {
                value: null,
                precision: 0
            },
            raw: {
                subject: ['homens'],
                action: ['mortos'],
            },
        }
        console.log(brain.results);
        // expect(results).toEqual(expected);
    })
})
