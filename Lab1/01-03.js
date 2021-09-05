let http=require('http');

let getContent=(request)=>
{
    let content="";
    for(key in request.headers)
    {
        content+=`<h3>${key} : ${request.headers[key]}</h3>`;
    } 
    return content;
}

http.createServer((request,response)=>
{
    let body="";
    request.on('data', str=>{body+=str; console.log('data', body);});
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    request.on("end", ()=>response.end(
        `<!DOCTYPE html><head></head>
        <body>
        <h1>Структура запроса</h1>
        <h2>метод: ${request.method}</h2>
        <h2>uri: ${request.url}</h2>
        <h2>версия: ${request.httpVersion}</h2>
        <h2>ЗАГОЛОВКИ</h2>
        ${getContent(request)}
        <h2>тело: ${body}</h2>
        </body>
        </html>`
    ));
}).listen(4000);

console.log("Server running at http://localhost:4000/");