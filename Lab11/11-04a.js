const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () =>{
    if(process.argv.length == 3)
    {
        console.log('parm2 = ', process.argv[2]);
        let date = new Date();

        ws.send(JSON.stringify({client: process.argv[2], timestamp: date.toTimeString()}));
        ws.on('message', data =>{
            console.log('on message: ', JSON.parse(data));
        })
    }
    else
    {
        ws.close();
    }
    
})