let http=require('http');
let fs=require('fs');

http.createServer((request, response)=>
{
    switch(request.url)
    {
        case "/fetch":
            let html=fs.readFileSync("./fetch.html");
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
            break;
        
        case "/api/name":
            response.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
            response.end("Кантор Казимир Владимирович");
            break;
    }
}
).listen(5000);

console.log('Server running at http://localhost:5000/fetch');