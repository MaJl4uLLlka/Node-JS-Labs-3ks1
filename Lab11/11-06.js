const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({port:4000, host: 'localhost'});

server.event('A');
server.event('B');
server.event('C');

process.stdin.setEncoding('utf-8');
process.stdin.on('readable' , () =>
{
    let chunk = '';
    while((chunk = process.stdin.read()) != null)
    {
        let eventName = chunk.trim();

        switch(eventName)
        {
            case 'A': server.emit('A');
            break;

            case 'B': server.emit('B');
            break;

            case 'C': server.emit('C');
            break;

            default: console.log('Unknow event name');
            break;
        }
    }

});

console.log("Server running");