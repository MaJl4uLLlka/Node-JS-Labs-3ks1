const net = require('net');

let HOST = '0.0.0.0';
let PORT = 40000;

let server = net.createServer();
server.on('connection', (sock) =>
{
    console.log('Server connected: ' + sock.remoteAddress + ': ' + sock.remotePort);

    let sum = 0;
    sock.on('data', (data) =>
    {
        sum += data.readInt32LE();
        console.log('Server data: ', data, sum);
    })

    let buf = Buffer.alloc(4);
    setInterval( ()=> {buf.writeInt32LE(sum, 0); sock.write(buf)}, 5000);

    sock.on('close', (data) => {console.log('Server closed: ', sock.remoteAddress + ': ' + sock.remotePort)})

    sock.on('error', (err) => {console.log(err.message);})
})

server.on('listening', ()=> { console.log('TCP-server ', HOST + ": " + PORT);});
server.on('error', (e) => {
    console.log(e.message);
})

server.listen(PORT, HOST);