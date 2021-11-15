const httpserver = require('http').createServer((req, resp)=>
{
    if(req.method === 'GET' && req.url === "/start")
    {
        resp.writeHead(200, {'Content-Type': 'text/html; charset= utf-8'});
        resp.end(require('fs').readFileSync('./index.html'));
    }
})

httpserver.listen(3000);
console.log('http server: 3000');

let n = 0;
let k = 0;
const WebSocket = require('ws');

const wsserver = new WebSocket.Server({port: 4000, host: 'localhost', path:'/wsserver'});

wsserver.on('connection', (ws) => {
    ws.on('message', message =>{
        let parts = message.toString('utf-8').split(' ');
        console.log(parts);

        let temp = parseInt(parts[1]);

        if(temp > n)
        {
            n = temp;
        }
        console.log('Message number=> ', n);
    })

    setInterval(()=> {ws.send(`10-01-server:${n}->${++k}`)}, 5000);
})

wsserver.on('error', (e)=> console.log('ws server error', e));
console.log(`wsserver: host:${wsserver.options.host}, port: ${wsserver.options.port}, path: ${wsserver.options.path}`);