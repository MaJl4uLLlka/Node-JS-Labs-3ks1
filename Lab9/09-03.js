const { write } = require('fs');
let http = require('http');
let query = require('querystring');

let params = query.stringify({x:3, y:4, s: 'string some'});
let path = `/mypath`;

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST'
}

let request = http.request(options, (resp) =>
{
    let data = '';

    console.log('Status', resp.statusCode);
    
    resp.on('data', chunk => data += chunk.toString('utf-8'));

    resp.on('end', ()=> console.log('Body params: ', data));
});

request.on('error', (e) => console.log("Error: ", e.message));

request.write(params);
request.end();