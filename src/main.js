import Hyperswarm from 'hyperswarm';
import { createHash } from 'crypto';
import readline from 'readline';

const swarm = new Hyperswarm()
const topic = createHash('sha256').update('chat').digest();

swarm.join(topic, {
    lookup: true, 
    announce: true
});

const peers = [];

swarm.on('connection', (socket, info) => {
    console.log(`🟢 Nuevo peer conectado: ${JSON.stringify(info)}`);
    peers.push(socket);

    socket.on('data', (data) => {
        console.log(`👤 ${data.toString()}`);
    });

    socket.on('close', () => {
        console.log('🔴 Peer desconectado');
        const index = peers.indexOf(socket);
        if (index !== -1) {
            peers.splice(index, 1);
        }
    });
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    peers.forEach((peer) => {
        peer.write(input);
    }); 
})