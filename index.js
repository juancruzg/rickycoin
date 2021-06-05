import PKG from './package.json';
import Block from './src/blockchain/block';

const { name, version } = PKG;

console.log(`${name} ${version}`);

const block = new Block(Date.now(), 'previous-hash', 'hash', 'data');

console.log(block.toString());
