let http = require('http');

let params = JSON.stringify(
    {
        __comment: "Запрос. Лабораторная работа 8/10",
        x: 1,
        y: 2, 
        s: "Сообщение",
        m: ["a", "b", "c", "d"],
        o: { surname: "Иванов", name: "Иван"}
    });
let path = `/json`;

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', 'Accept': 'application/json'
    }
}

let request = http.request(options, (resp) =>
{
    let data;

    console.log('Status', resp.statusCode);
    
    resp.on('data', chunk => data = JSON.parse(chunk));

    resp.on('end', ()=> console.log('Body params: ', data));
});

request.on('error', (e) => console.log("Error: ", e.message));

request.write(params);
request.end();