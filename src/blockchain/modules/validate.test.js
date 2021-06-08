import Blockchain from '../blockchain';
import validate from './validate';

describe('validate()', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('validates a valid chain', () => {
        blockchain.addBlock('block-1');
        blockchain.addBlock('block-2');

        expect(validate(blockchain.blocks)).toBe(true);
    });

    it('invalidates a chain with corrupt genesis block', () => {
        blockchain.blocks[0].date = 'b4d d4t4';

        expect(() => {
            validate(blockchain.blocks);
        }).toThrowError('Invalid Genesis block.');
    });

    it('invalidates a chain with corrupt previous hash within a block', () => {
        blockchain.addBlock('block-1');
        blockchain.blocks[1].previousHash = 'ammahacker';

        expect(() => {
            validate(blockchain.blocks);
        }).toThrowError('Invalid previous hash.');
    });

    it('invalidates a chain with corrupt hash within a block', () => {
        blockchain.addBlock('block-1');
        blockchain.blocks[1].hash = 'ammahacker';

        expect(() => {
            validate(blockchain.blocks);
        }).toThrowError('Invalid hash.');
    });
});
