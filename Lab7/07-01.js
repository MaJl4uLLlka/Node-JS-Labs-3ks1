const http = require('http');
const fs   = require('fs');
const url  = require('url');
let {getFile} = require('./m07-01');

http.createServer( (req, resp) =>
{
    if(req.method == 'GET')
    {
        if(req.url === '/')
        {
            let html = fs.readFileSync('./index.html');
            resp.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
            resp.end(html);
        }
        else
        {
            getFile(url.parse(req.url).pathname)
            .then(data => 
                {
                    resp.writeHead(200, {'Content-Type': data.MIME});
                    console.log(data);

                    if(data.isImage)
                    {
                        resp.writeHead(200, {'Content-Type': data.MIME, 'Content-Length': data.contentLength});
                        resp.end(data.fileContent, 'binary');
                    }
                    else
                    {
                        if(data.isJSON)
                        {
                            resp.end(JSON.stringify(data.fileContent));
                        }
                        else {
                            resp.end(data.fileContent);
                        }  
                    }
                })
            .catch((err) =>
            {
                console.log(err.message);
                resp.writeHead(404, {'Content-Type': 'text/html; charset = utf-8'});
                resp.end(`<h1>${err.message}</h1>`);
            })
        }
        
    }
    else
    {
        resp.writeHead(405, {'Content-Type':'text/html;charset = utf-8'});
        resp.end("<h1>Method isn't GET</h1>");
    } 
}).listen(5000);

console.log('Server running at http://localhost:5000');