let http = require('http');
let currentState = null;

http.createServer( function (req, resp)
{
    resp.writeHead(200, {'Content-Type':'text/html'});
    resp.end(`<h1>${currentState}</h1>`);
}
).listen(5000, ()=>
{
    currentState = 'norm';
    process.stdout.write('norm-> ');
});

console.log('Server running at http://localhost:5000');

process.stdin.setEncoding('utf-8'); //обязательная строка
process.stdin.on('readable', ()=>{

    let chunk= null;
    while((chunk = process.stdin.read()) != null)
    {
        let newState = chunk.trim();
        let knowComand= true;

        switch(newState)
        {
            case 'norm':
                currentState = 'norm';
                break;

            case 'stop':
                currentState = 'stop';
                break;

            case 'test':
                currentState = 'test'; 
                break;

            case 'idle':
                currentState = 'idle';
                break;

            case 'exit': process.exit(0);

            default:
                knowComand = false; 
                process.stdout.write(`${newState} = ${currentState}--> `);
                break;
        }

        if(knowComand)
        {
            process.stdout.write(`${currentState}-> `);
        }
    }
}
)