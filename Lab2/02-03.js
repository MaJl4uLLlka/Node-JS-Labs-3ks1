let http=require('http');

http.createServer((request, response)=>
{
    if(request.url==="/api/name")
    {
        response.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
        response.end("Кантор Казимир Владимирович");
    }
}
).listen(5000);

console.log('Server running at http://localhost:5000/api/name');