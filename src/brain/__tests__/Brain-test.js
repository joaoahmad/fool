import Brain from '../Brain';
import BrainOld from '../index';
const sentence = 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.';

describe('Brain', () => {
    it('initialize sentence analysis', () => {
        const results = new Brain(sentence);
        const expected = {
            input: 'Dois homens foram mortos na Avenida Brasil, na altura da Penha, na pista em direção ao Centro da cidade.',
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
                // location: ['avenida brasil'],
            },
        }
        expect(results).toEqual(expected);
    })
})
