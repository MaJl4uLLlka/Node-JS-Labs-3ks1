let http = require('http');
let fs = require('fs');

let path = `/fileimg`;
let bound = 'k123-k123-k123';

let body  = `--${bound}\r\n`;
    body += 'Content-Disposition:form-data; name="file"; filename="MyFile.png"\r\n';
    body += 'Content-Type:application/octet-stream\r\n\r\n';

let options =
{
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST',
    headers: {'Content-Type': 'multipart/form-data; boundary='+ bound, 'Accept':'text/plain'}
}


let request = http.request(options, (response) =>
{
    let data = '';

    response.on('data', (chunk) => {data += chunk});

    response.on('end', ()=> console.log('http.request: end: length body= ', Buffer.byteLength(data)));
});

request.on('error', (e) => console.log("Error: ", e.message));
request.write(body);

let stream = new fs.ReadStream('MyFile.png');
stream.on('data', (chunk)=> {request.write(chunk); console.log(Buffer.byteLength(chunk))});
stream.on('end', () => {request.end(`\r\n--${bound}--\r\n`);});