let http = require('http');
let fs = require('fs');

let path = `/file`;
let bound = 'k123-k123-k123';

let body  = `--${bound}\r\n`;
    body += 'Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n';
    body += 'Content-Type:text/plain\r\n\r\n';
    body += fs.readFileSync('MyFile.txt');
    body += `\r\n--${bound}--\r\n`;

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

    response.on('end', ()=> console.log('http.request: end: body= ', data));
});

request.on('error', (e) => console.log("Error: ", e.message));

request.write(body);
request.end();