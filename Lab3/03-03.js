let http = require('http');
let fs =   require('fs');
let url =  require('url');

http.createServer((req, resp) =>
{

    let rc = JSON.stringify({ k: 0});
    if(url.parse(req.url).pathname === '/fact')
    {
        console.log(req.url);
        if( typeof url.parse(req.url, true).query.k != 'undefined')
        {
            let k = parseInt(url.parse(req.url, true).query.k );
            if( Number.isInteger(k)){
                resp.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                resp.end(JSON.stringify({k:k, fact: fact(k) }));
            }
        }
        
    }
    else if(url.parse(req.url).pathname === '/')
    {
            let html = fs.readFileSync('./03-03.html');
            resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            resp.end(html);
    }
    else {
        resp.end(rc);
    }

}).listen(5000);

console.log('Server running at http://localhost:5000/');

function fact(k){ return (k <= 1? 1: k * fact(k-1)); }