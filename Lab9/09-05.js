let http = require('http');
let xml2js = require('xml2js');

let builder = new  xml2js.Builder();

let xml  = builder.buildObject(
    {
        request: {
            '$': {id: 28},
            x: [
                {'$': {value: 1}},
                {'$': {value: 2}}
            ],

            m: [
                {'$': {value: 'a'}},
                {'$': {value: 'b'}},
                {'$': {value: 'c'}},
            ]
        }
    });

let path = `/xml`;

let options =
{
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST',
    headers: {'Content-Type': 'text/xml', 'Accept': 'text/xml'}
}


let request = http.request(options, (response) =>
{
    let data = '';

    response.on('data', chunk => data += chunk);

    response.on('end', ()=> console.log('XML from Body: ', data));
});

request.on('error', (e) => console.log("Error: ", e.message));

request.write(xml);
request.end();