class FoolBase {
    constructor(input) {
        this.input = input.toLowerCase();
        this.results = {
            input: null,
            context: null,
            subject: null,
            location: {
                value: null,
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
                subject: [],
                action: [],
            }
        }
        this.bootstrap();
    }
    bootstrap(){}
}

export default FoolBase;
