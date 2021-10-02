let http = require('http');
let fs   = require('fs');
let url  = require('url');
let data = require('./db');

var db = new data.DB();

db.on('GET',  (req,resp)=>{
    setImmediate(() =>
    {
        console.log('DB.GET');
        resp.end(JSON.stringify(db.select()));
    })
});

db.on('POST', (req,resp)=>{

    setImmediate(() =>
    {
        console.log('DB.POST');
        req.on('data', data=>{
        let r = JSON.parse(data);
        db.insert(r);
        resp.end(JSON.stringify(r));
        });
    })
});

db.on('PUT',  (req, resp) => {

    setImmediate(() =>
    {
        console.log('DB.PUT');
        req.on('data', data => {
        let r = JSON.parse(data);
        resp.end(JSON.stringify(db.update(r)) );
        })
    })
});

db.on("DELETE",  (req, resp) => {

    setImmediate(() =>
    {
        console.log('DB.DELETE');
    
        if( typeof url.parse(req.url, true).query.id != 'undefined')
        {
            let id = parseInt(url.parse(req.url, true).query.id);
            if(Number.isInteger(id))
            {
                resp.end( JSON.stringify(db.delete(id)) );
            }
        }
    })
});


http.createServer( function (request, response)
{
    if(url.parse(request.url).pathname === '/')
    {
        let html = fs.readFileSync('./04-02.html');
        response.writeHead(200, {'Content-Type':'text/html; charset = utf-8'});
        response.end(html);
    }
    else if(url.parse(request.url).pathname === '/style.css')
    {
        let cssFile = fs.readFileSync("./style.css");
        response.writeHead(200, {"Content-Type": "text/css"});
        response.end(cssFile);
    }
    else if(url.parse(request.url).pathname === '/api/db')
    {
        db.emit(request.method, request, response);
    }
}
).listen(5000);

console.log("Server running at http://localhost:5000/");
