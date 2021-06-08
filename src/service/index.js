import express from 'express';

import Blockchain from '../blockchain';
import P2PService from './p2p';

const { HTTP_PORT = 3000 } = process.env;

const app = express();
const blockchain = new Blockchain();
const p2pService = new P2PService(blockchain);

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.get('/blocks', (_, res) => {
    res.json(blockchain.blocks);
});

app.post('/mine', (req, res) => {
    const { body: { data } } = req;

    const block = blockchain.addBlock(data);

    // Whenever we mine a new block, we want all nodes to sync.
    p2pService.sync();

    res.json({
        blocks: blockchain.blocks.length,
        block,
    });
});

app.listen(HTTP_PORT, () => {
    console.log(`Service HTTP:${HTTP_PORT} listening...`);
    p2pService.listen();
});
