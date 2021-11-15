let http = require('http');
let query = require('querystring');

let parms = query.stringify({x:3, y:4});
let path = `/mypath?${parms}`;

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'GET'
}

const req = http.request(options, (response) =>
{
    let data = '';

    console.log(path);
    console.log('Status: ', response.statusCode);

    response.on('data', chunk => 
    {
        data += chunk;
    })

    response.on('end', ()=> console.log('Body data: ', data));
})

req.on('error', (e) => console.log("Error: ", e.message));
req.end();