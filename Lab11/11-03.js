const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 4000, host: 'localhost'});

wss.on('connection', (ws) =>
{
    let n = 0;

    ws.on('ping', data =>
    {
        console.log('ping ->send: pong');
        let count_active_clients = 0;
        wss.clients.forEach(client =>
            {
                if(client.readyState === WebSocket.OPEN) count_active_clients ++;
            })

        console.log('active connections: ',count_active_clients);
        ws.pong(data);
    })

    let interval = setInterval(()=>{ws.send(`11-03-server: ${n++}`)}, 15000);

    ws.on('close', () => 
    {
        clearInterval(interval);
    })
})

console.log("Server running");