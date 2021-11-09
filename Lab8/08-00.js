const http = require('http');
const fs   = require('fs');
const url = require("url");
const queryParser = require('querystring');
const mymodule = require('./m07-01')('./static/');
let mp = require('multiparty');
let xml2js = require('xml2js');

const supportedMethods =
{
    GET:  "GET",
    POST: "POST"
}

let id = 0;
let respNumber = 0;

let server = http.createServer().listen(5000);

server.on("request",(req, resp) => 
{
    let urlParts = url.parse(req.url).pathname.split("/");

    urlParts.splice(0,1);

    console.log(urlParts);

    if(req.method === supportedMethods.GET)
    {
        switch(urlParts[0])
        {
            case "connection":
                if(urlParts.length === 1)
                {
                    let set;
                    if(typeof url.parse(req.url, true).query.set != 'undefined')
                    {
                        set = parseInt(url.parse(req.url, true).query.set);

                        if(Number.isInteger(set))
                        {
                            console.log(set);
                            server.keepAliveTimeout = set;
                        }
                    }
                    
                    id++;
                    resp.writeHead(200, {'Content-Type': 'text/html'});
                    resp.end(`<h2>Keep Alive Timeout: ${server.keepAliveTimeout}</h2>`);
                }
                else
                {
                    HTTP404(resp);
                }

                break;
            
            
            case "headers":
                if(urlParts.length === 1)
                {
                    id++;
                
                    resp.setHeader('Content-Type','text/html; charset = utf-8');
                    resp.statusCode = 200;

                    let myHeader ={
                        name: 'my-header',
                        value: 'my header value'
                    };
                    
                    resp.setHeader(myHeader.name, myHeader.value);

                    resp.write(`<table><tr><th>Request Headers</th><th>Value</th></tr>`);
                    for(let key in req.headers)
                    {
                        resp.write(`<tr><td>${key}</td><td>${req.headers[key]}</td></tr>`);
                    }
                    resp.write(`</table>`);

                    resp.write('<br><br>');

                    
                    resp.write(`<table><tr><th>Response Headers</th><th>Value</th></tr>`);

                    for(let key in resp.getHeaders())
                    {
                        resp.write(`<tr><td>${key}</td><td>${resp.getHeaders()[key]}</td></tr>`);
                    }

                    resp.end(`</table>`);
                }
                else
                {
                    HTTP404(resp);
                }
                break;

            case "parameter":
                if(urlParts.length === 1)
                {
                    resp.writeHead(200, {'Content-Type': 'text/html'});

                    if(typeof url.parse(req.url, true).query.x != 'undefined' && typeof url.parse(req.url, true).query.y  != 'undefined')
                    {
                        let x = parseInt(url.parse(req.url, true).query.x);
                        let y = parseInt(url.parse(req.url, true).query.y);

                        if(Number.isInteger(x) && Number.isInteger(y))
                        {
                            id++;
                            resp.end(`<h4>x + y = ${x+y}</h4>
                                      <h4>x - y = ${x-y}</h4>
                                      <h4>x * y = ${x*y}</h4>
                                      <h4>x / y = ${x/y}</h4>`);
                            return;
                        }
                        else
                        {
                            id++
                            resp.end("Parameter x or parameter y isn't a number");
                            return;
                        }
                    }
                }
                else if(urlParts.length === 3)
                {
                    resp.writeHead(200, {'Content-Type': 'text/html'});
                    let x = parseInt(urlParts[1]);
                    let y = parseInt(urlParts[2]);

                    if(Number.isInteger(x) && Number.isInteger(y))
                    {
                        id++;
                        resp.end(`<h4>x + y = ${x+y}</h4>
                                  <h4>x - y = ${x-y}</h4>
                                  <h4>x * y = ${x*y}</h4>
                                  <h4>x / y = ${x/y}</h4>`);
                        return;
                    }
                    else
                    {
                        id++;
                        resp.end(url.parse(req.url).pathname);
                        return;
                    }
                }
                else
                {
                    HTTP404(resp);
                }
                break;
            
            case "close":
                if(urlParts.length === 1)
                {
                    id++;
                    resp.writeHead(200, {"Content-Type": "text/html; charset = utf-8"});
                    resp.end("<h2>10 seconds before server closing</h2>");
                    setTimeout( ()=>
                    {
                        console.log('closing');
                        
                        process.stdout.unref();
                        process.stdin.unref();
                        process.stdout.unref();
                        
                        server.unref();
                        server.close();
                    },  10 * 1e3);
                }
                else
                {
                    HTTP404(resp);
                }

                break;
            
            case "socket":
                if(urlParts.length === 1)
                {
                    id++;
                    resp.writeHead(200 , {'Content-Type':'text/html; charset=utf-8'});
                    resp.end(`<h2>server IP: ${req.socket.localAddress}</h2>
                              <h2>server port: ${req.socket.localPort}</h2>
                              <h2>client IP: ${req.socket.remoteAddress}</h2>
                              <h2>client port: ${req.socket.remotePort}</h2>`);
                }
                else
                {
                    HTTP404(resp);
                }

                break;
            
            case "req-data":
                if(urlParts.length === 1)
                {
                    req.on('data', data => 
                    {
                        id++;
                        console.log("resp number ", ++respNumber)
                        console.log(data.length)
                    });

                    respNumber = 0;
                    resp.end();
                }
                else
                {
                    HTTP404(resp);
                }
                break;
            
            case "resp-status":
                if(urlParts.length === 1)
                {
                    if(typeof url.parse(req.url, true).query.code != 'undefined' && typeof url.parse(req.url, true).query.mess  != 'undefined')
                    {
                        let httpCode = parseInt(url.parse(req.url, true).query.code);
                        let mess = url.parse(req.url, true).query.mess;

                        if(Number.isInteger(httpCode))
                        {
                            id++;
                            resp.statusMessage = mess;
                            resp.writeHead(httpCode , {'Content-Type': 'text/html'})
                            //resp.writeHead(httpCode ,mess ,{'Content-Type': 'text/html'})
                            resp.end(`<h2>${mess}</h2>`);
                            return;
                        }
                        else
                        {
                            id++;
                            resp.writeHead(200, {'Content-Type': 'text/html'});
                            resp.end("<h2>Parameter code must have a number value</h2>");
                            return;
                        }
                    }
                }
                else
                {
                    HTTP404(resp);
                }
                break;
            
            case "files":
                if(urlParts.length === 1)
                {
                    id++;
                    let filesCount = fs.readdirSync('static').length;
                    resp.setHeader('X-static-files-count', filesCount);
                    resp.end();
                }
                else if(urlParts.length === 2)
                {
                    id++;
                    mymodule.getFile(urlParts[1])
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
                else
                {
                    HTTP404(resp);
                }
                break;

            case "upload":
                if(urlParts.length === 1)
                {
                    id++;
                    let web_form = fs.readFileSync('static/upload-form.html');
                    resp.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                    resp.end(web_form);
                }
                else
                {
                    HTTP404(resp);
                }
                break;

            case "form":
                if(urlParts.length === 1)
                {
                    id++;
                    let form = fs.readFileSync('static/form.html');
                    resp.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                    resp.end(form);
                }
                else
                {
                    HTTP404(resp);
                }
                break;

            default:
                HTTP404(resp);
                break;
        }


    }
    else if (req.method === supportedMethods.POST)
    {
        switch(urlParts[0])
        {
            case "formparameter":
                if(urlParts.length === 1)
                {
                    id++;
                    let result = '';
                    resp.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
                    let form = new mp.Form({uploadDir: './static'});

                    form.on('field', (name, value) =>
                    {
                        result+= `<br>${name}: ${value}`;
                    });

                    form.on('error', (err)=>
                    {
                        console.log(err.message);
                        resp.end('<h1>Form Error</h1>');
                    })

                    form.on('close', ()=>
                    {
                        resp.write('<h2>Form</h2>');
                        resp.end(result);
                    })

                    form.parse(req);
                }
                else
                {
                    HTTP404(resp);
                }
                break;
            
            case "json":

                if(urlParts.length === 1)
                {
                    id++;
                    req.on('data', (data) =>
                    {
                        let respJson = {
                            __comment: "Ответ.",
                            x_plus_y: 0,
                            Concatination_s_o: "",
                            Length_m: 0
                        }

                        let obj = JSON.parse(data);
                        console.log(obj);

                        let comment = obj.__comment.split('.');
                        comment.splice(0,1);

                        respJson.__comment += comment[0];
                        respJson.x_plus_y = obj.x + obj.y;
                        respJson.Concatination_s_o += obj.s+': '+ obj.o.surname +', '+ obj.o.name;
                        respJson.Length_m = obj.m.length;

                        resp.end(JSON.stringify(respJson));
                    })
                }
                else
                {
                    HTTP404(resp);
                }
                break;
            
            case "xml":
                if(urlParts.length === 1)
                {
                    let body = null;
                    id++;
                    req.on('data', (data) =>{
                        body = data;
                        })
                        
                        req.on('end', () => {
                        let xml = body.toString("utf-8");
                        let concat = "";
                        let sum = 0;
                        
                        xml2js.parseString(xml, function (err, result) {
                        console.dir(result);
                        
                        for (let i = 0; i < result.request.m.length; i++){
                        concat += result.request.m[i].$.value;
                        }
                        
                        for (let i = 0; i < result.request.x.length; i++){
                        sum += Number.parseInt(result.request.x[i].$.value);
                        }
                        
                        let builder = new xml2js.Builder();
                        let xml = builder.buildObject(
                        {
                        response: {
                        '$': {id: id, request: result.request.$.id},
                        sum: {
                        '$': {element: 'x', result: sum}
                        },
                        concat: {
                        '$': {element: 'm', concat: concat}
                        }
                        }
                        }
                        );
                        
                        //console.dir(xml);
                        resp.writeHead(200, {'Content-Type': 'application/xml; charset = utf-8'});
                        resp.end(xml);
                        })
                        })
                }
                else
                {
                    HTTP404(resp);
                }
                break;
            
            case "upload":
                if(urlParts.length === 1)
                {
                    id++;
                    resp.writeHead(200, {'Content-Type':'text/html;charset = utf-8'});
                    let result = '';
                    let upload_form =new  mp.Form({uploadDir:'./static'});

                    upload_form.parse(req);
                    upload_form.on('field', (name, value) =>
                    {
                        result+= `<br>${name}: ${value}`;
                    });

                    upload_form.on('file', (name, file) =>
                    {
                        result+= `<br/> -- ${name} = ${file.originalFilename}: ${file.path}`;
                    })

                    upload_form.on('error', (err)=>
                    {
                        console.log(err.message);
                        resp.end('<h1>Form Error</h1>');
                    })

                    upload_form.on('close', ()=>
                    {
                        resp.write('<h2>Form</h2>');
                        resp.end(result);
                    })

                }
                else
                {
                    HTTP404(resp);
                }
                break;
            
            default:
                HTTP404(resp); 
                break;
        }
    }
    else
    {
        HTTP405(resp);   
    }
})
server.on("connection", socket => 
{
    console.log("new Connection");
    socket.unref();
})

function HTTP404(resp)
{
    id++;
    resp.writeHead(404, {'Content-Type':'text/html;charset = utf-8'});
    resp.end("<h1>Not Found</h1>");
}

function HTTP405(resp)
{
    id++;
    resp.writeHead(405, {'Content-Type':'text/html;charset = utf-8'});
    resp.end("<h1>Method isn't supported</h1>");
}

console.log("Server running at http://localhost:5000/");