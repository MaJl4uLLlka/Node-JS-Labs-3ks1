const buffer = require('buffer');
const udp = require('dgram');
const client = udp.createSocket('udp4');
const PORT = 3000;

client.on('message', (msg, info)=>
{
    console.log('Client: от сервера получено ' + msg.toString());
    console.log('Client: получено %d байтов от %s:%d\n',msg.length,info.address,info.port);
});

let data = Buffer.from('Client: message 01');
client.send(data,PORT, 'localhost', (err)=>{
    if(err) client.close();
    else console.log('Client: сообщение отправлено серверу');
});

let data1 = Buffer.from('Hello ');
let data2 = Buffer.from('World');

client.send([data1, data2], PORT, 'localhost', (err)=>
{
    if(err) client.close();
    else console.log('Client: сообщение отправлено серверу');
})