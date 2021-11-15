let http = require("http");

let optinons = {
    host: 'localhost',
    path: '/',
    port: 5000,
    method: 'GET'
}

const request = http.request( optinons, (response) =>
{
    console.log('Status: ', response.statusCode);
    console.log('Status Message: ', response.statusMessage);
    console.log('Server IP : ', response.socket.remoteAddress);
    console.log('Server port : ', response.socket.remotePort);
    
    let data = '';

    response.on('data', chunk =>
    {
        data += chunk;
    })

    response.on('end', () => console.log('Response body: ', data));
});

request.on('error', (e) => console.log("Error: ", e.message));
request.end();