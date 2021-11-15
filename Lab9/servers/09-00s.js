let http = require('http');
let fs   = require('fs');
let url  = require('url');
let xml2js = require('xml2js');
let mp = require('multiparty');

let id = 0;

let server = http.createServer( (req, resp) =>
{
    if(req.method === "GET")
    {
        GET_handler(req, resp);
    }
    else if( req.method === "POST")
    {
        POST_handler(req, resp);
    }
    else
    {
        HTTP405(resp);
    }
    
}).listen(5000);

console.log('Server running');

function HTTP405(resp)
{
    resp.writeHead(405, {'Content-Type': 'text/plain'});
    resp.end();
}

function HTTP404(resp)
{
    resp.writeHead(405, {'Content-Type': 'text/plain'});
    resp.end();
}

function GET_handler(req, resp)
{
    switch(url.parse(req.url).pathname)
    {
        case '/':
            resp.writeHead(200, 'Cool ', {'Content-type':'text/plain'} );
            resp.end('body data');
            break;
        
        case '/mypath':
            resp.writeHead(200, 'Cool ', {'Content-type':'text/plain'} );
            resp.end(url.parse(req.url).query);
            break;
        
        case '/getfile':
            resp.end(fs.readFileSync('../MyFile.txt'))
            break;
        default:
            HTTP404(resp);
            break;
    }
}

function POST_handler(req, resp)
{
    switch(url.parse(req.url).pathname)
    {
        case '/mypath':
            let data = '';
            resp.writeHead(200, 'Cool ', {'Content-type':'text/plain'} );
            
            req.on('data', part =>
            {
                data += part;
            })
    
            req.on('end', ()=> resp.end(data))
            break;
        
        case '/json':
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
            break;

        case '/xml':
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
            break;
        
        case '/file':
            {
                let result = '';

                let form = new mp.Form({uploadDir: './'});

                form.on('file', (name, file) =>
                {
                    console.log(name, file);
                    result += `--${name}= ${file.originalFilename}: ${file.path}`;
                })

                form.on('close', ()=> 
                {
                    resp.writeHead(200, {'Content-Type': 'text/plain'});
                    resp.write('Form');
                    resp.end(result);
                })

                form.parse(req);
            }
            break;
        
        case '/fileimg':
            {
                let result = '';

                let form = new mp.Form({uploadDir: './'});

                form.on('file', (name, file) =>
                {
                    console.log(name, file);
                    result += `--${name}= ${file.originalFilename}: ${file.path}`;
                })

                form.on('close', ()=> 
                {
                    resp.writeHead(200, {'Content-Type': 'text/plain'});
                    resp.write('Form');
                    resp.end(result);
                })

                form.parse(req);
            } 
            break;
        
        default:
            HTTP404(req);
            break;
    }
}