const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');
ws.on('open', () =>
{
    ws.on('message', (data) =>{
        console.log('message: ', data.toString('utf-8'));
    })

    ws.on('pong', (data) =>
    {
        console.log('Connected');
    })

    setInterval(() => {ws.ping('Client')}, 5000);
})