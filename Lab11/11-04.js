const WebSocket = require('ws');

const wss = new WebSocket.Server({host: 'localhost', port: 4000});

let messageId = 0;

wss.on('connection', (ws) =>{
    ws.on('message', (data) => {
        console.log('on message: ', JSON.parse(data));
        let obj = JSON.parse(data);
        ws.send(JSON.stringify({server: messageId++, client: obj.client, timestamp: obj.timestamp}));
    });

})

console.log('Server running');