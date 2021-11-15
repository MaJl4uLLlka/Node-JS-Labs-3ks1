let http = require('http');
let fs = require('fs');

let path = `/getfile`;
let bound = 'k123-k123-k123';

let body  = `--${bound}\r\n`;
    body += 'Content-Disposition:form-data; name="file"; filename="MyFile.png"\r\n';
    body += 'Content-Type:application/octet-stream\r\n\r\n';

let options =
{
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'GET',
    headers: {'Content-Type': 'multipart/form-data; boundary='+ bound, 'Accept':'text/plain'}
}


let request = http.request(options, (response) =>
{
    console.log('Check file newFile.txt');
    response.pipe(fs.createWriteStream("newFile.txt"));
});

request.on('error', (e) => console.log("Error: ", e.message));

request.end();