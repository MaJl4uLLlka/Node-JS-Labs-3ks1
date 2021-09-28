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
        else
        {
            resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            resp.end('<h1>Undefined parametr</h1>');
        }
    }

}).listen(5000);

console.log('Server running at http://localhost:5000/fact?k=x');
function fact(k){ return (k <= 1? 1: k * fact(k-1)); }