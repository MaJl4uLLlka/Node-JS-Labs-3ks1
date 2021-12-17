const net = require('net');

let HOST = '0.0.0.0';
let PORT = 40000;

net.createServer( (sock) =>
{
    console.log('Server connected: ' + sock.remoteAddress + ': ' + sock.remotePort);

    sock.on('data', (data) =>
    {
        console.log('Server data: ', sock.remoteAddress + ': ' + data);
        sock.write('ECHO: ' + data);
    })
}).listen(PORT, HOST);

console.log('TCP-сервер '+ HOST+ ': ' + PORT);