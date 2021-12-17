const fs = require('fs');
const WebSocket = require('ws');

const wss = new  WebSocket.Server({host: 'localhost', port: 4000});

wss.on('connection', (ws) =>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf-8'});
    let rfile = fs.createReadStream('./download/ClientFile.txt');
    rfile.pipe(duplex);
})

console.log('Server running');