import Block from './block';

describe('Block', () => {
    let timestamp;
    let previousBlock;
    let data;
    let hash;
    let nonce;

    beforeEach(() => {
        timestamp = new Date(2010, 0, 1);
        previousBlock = Block.genesis;
        data = 't3st-d4t4';
        hash = 'h4sh';
        nonce = 128;
    });

    it('create an instance with parameters', () => {
        const block = new Block(timestamp, previousBlock.hash, hash, data, nonce);

        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
        expect(block.nonce).toEqual(nonce);
    });

    it('use static mine()', () => {
        const block = Block.mine(previousBlock, data);
        const { difficulty } = block;

        expect(block.hash.length).toEqual(64);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).not.toEqual(0);
        expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
    });

    it('use static hash()', () => {
        hash = Block.hash(timestamp, previousBlock.hash, data, nonce);

        expect(hash).toEqual('0d2724e419e1835ddf767a337391c36757f8e3335de1d383ee741f4a047a8695');
    });

    it('use toString()', () => {
        const block = Block.mine(previousBlock, data);

        expect(typeof block.toString()).toEqual('string');
    });
});
