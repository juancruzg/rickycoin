import adjustDifficulty from './adjust-difficulty';

describe('validate()', () => {
    let block;

    beforeEach(() => {
        block = { timestamp: Date.now(), difficulty: 3 };
    });

    it('should lower the difficulty for slowly mined blocks', () => {
        expect(adjustDifficulty(block, block.timestamp + 60000)).toEqual(block.difficulty - 1);
    });

    it('should increment the difficulty for quick mined blocks', () => {
        expect(adjustDifficulty(block, block.timestamp + 1000)).toEqual(block.difficulty + 1);
    });
});
