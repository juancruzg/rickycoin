import WebSocket from 'ws';

const { P2P_PORT = 5000, PEERS } = process.env;
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGE = { BLOCKS: 'blocks' };

class P2PService {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on('connection', (socket) => this.handleConnection(socket));

        peers.forEach((peer) => {
            const socket = new WebSocket(peer);
            socket.on('open', () => this.handleConnection(socket));
        });

        console.log(`Service ws:${P2P_PORT} listening...`);
    }

    handleConnection(socket) {
        console.log('[ws:socket] connected.');

        const { blockchain, blockchain: { blocks } } = this;
        this.sockets.push(socket);

        // We make the other nodes know about the new connection.
        socket.on('message', (message) => {
            const { type, value } = JSON.parse(message);

            // Try to replace so that we can sync all nodes.
            try {
                if (type === MESSAGE.BLOCKS) blockchain.replace(value);
            } catch (error) {
                console.log(`[ws:message] error ${error}`);
            }

            console.log({ type, value });
        });

        socket.send(JSON.stringify({ type: MESSAGE.BLOCKS, value: blocks }));
    }

    // This method will be syncing all nodes.
    sync() {
        const { blockchain: { blocks } } = this;
        this.broadcast(MESSAGE.BLOCKS, blocks);
    }

    broadcast(type, value) {
        console.log(`[ws:boradcast] ${type}...`);
        const message = JSON.stringify({ type, value });

        this.sockets.forEach((socket) => socket.send(message));
    }
}

export default P2PService;
