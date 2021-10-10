const http = require('http');
const fs   = require('fs');
const url  = require('url');
const nodemailer = require('nodemailer');

http.createServer((request, response) => 
{

    let body="";
    request.on('data', str=>{body+=str; console.log('data', body);});

    switch(url.parse(request.url).pathname)
    {
        case '/' :
            let html = fs.readFileSync('./06-02.html');
            response.writeHead(200, {'Content-Type':'text/html; charset = utf-8'});
            response.end(html);
            break;

        case '/send':
            response.end(body);
            break;

        default:
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end('<h1>Not found</h1>');  
            break;
    
    }
}).listen(5000);

console.log("Server running at http://localhost:5000/");