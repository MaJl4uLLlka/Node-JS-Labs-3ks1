const net = require('net');

let HOST = '127.0.0.1';
let PORT = 40000;

let client = new net.Socket();
let buf = Buffer.alloc(4);
let timer = null;
let X;

client.connect(PORT, HOST, () => {
     console.log('Client connected: ', client.remoteAddress + ': '+ client.remotePort)
     
     X = process.argv[2];
     timer = setInterval(() => {client.write((buf.writeInt32LE(X,0), buf))}, 1000);
     setTimeout( () => {
         clearInterval(timer);
         client.end();
    }, 20000)
});

client.on('data', (data) => {console.log('Client data: ', data.readInt32LE())});

client.on('close', () => {console.log('Client close');});

client.on('error', (e) =>{console.log(e.message);})