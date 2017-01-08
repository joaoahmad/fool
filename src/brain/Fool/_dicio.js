export default [
    {
        key: 'duas',
        data: {
            numeral: 2
        }
    },
    {
        key: 'dois',
        data: {
            numeral: 2
        }
    },
    {
        key: 'homens',
        data: {
            human: true,
            male: true,
            noun: true,
            plural: 'homem',
        }
    },
    {
        key: 'mulheres',
        data: {
            human: true,
            female: true,
            noun: true,
            plural: 'mulher',
        }
    },
    {
        key: 'foram',
        data: {
            verb: {
                'ir': [
                    'plural',
                    'past'
                ],
                'ser': [
                    'plural',
                    'past'
                ],
            }
        }
    },
    {
        key: 'mortos',
        data: {
            male: true,
            verb: {
                'matar': [
                    'plural',
                    'past'
                ],
                'morrer': [
                    'plural',
                    'past'
                ],
                'morto': [
                    'plural',
                    'present'
                ],
            }
        }
    },
    {
        key: 'na',
        data: {
            prev_location: true
        }
    },
]
