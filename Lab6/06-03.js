const http = require('http');
const fs   = require('fs');
const url  = require('url');
const {send} = require('./mymodule/m0603kkv');

let message = null;
http.createServer((request, response) => 
{
    switch(url.parse(request.url).pathname)
    {
        case '/' :
            let html = fs.readFileSync('./06-03.html');
            response.writeHead(200, {'Content-Type':'text/html; charset = utf-8'});
            response.end(html);
            break;

        case '/send':
            request.on('data', data=>{ 
                message = JSON.parse(data);
                console.log(message);
                send(message.text);
                response.end(0);
            });
            break;

        default:
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end('<h1>Not found</h1>');  
            break;
    
    }
}).listen(5000);

console.log("Server running at http://localhost:5000/");