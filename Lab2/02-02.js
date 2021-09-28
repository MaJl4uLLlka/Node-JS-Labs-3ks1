let http=require('http');
let fs=require('fs');

http.createServer((request, response)=>
{
    if(request.url==="/png")
    {
        const fileName="./pic.png";
        let png=null;

        fs.stat(fileName, (err,stat)=>
        {
            if(err) console.log('error:', err);
            else
            {
                png=fs.readFileSync(fileName);
                response.writeHead(200,{'Content-Type':'image/png', 'Content-Length':stat.size});
                response.end(png,'binary');
            }
        })
    }
}
).listen(5000);

console.log('Server running at http://localhost:5000/png');