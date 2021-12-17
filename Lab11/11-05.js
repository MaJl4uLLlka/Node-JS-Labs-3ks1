const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({host: 'localhost', port: 4000});

server.setAuth((l) => { return (l.login == 'kkv' && l.password == '456')})

server.register('square', (params) =>{
    if(params.length == 1)
    {
        return Math.PI * params[0] * params[0];
    }
    else if(params.length == 2)
    {
        return params[0] * params[1];
    }
    else return 0;
}).public();

server.register('sum', (params) =>{
    let result = 0;
    for(let i=0; i < params.length; i++)
    {
        result += params[i];
    }

    return result;
}).public();

server.register('mul', (params) =>{
    let result = 1;
    for (let index = 0; index < params.length; index++) {
         result *= params[index];
    }
    return result;
}).public();

server.register('fib', (n) =>
{
    let array = new Array(n);
    let firstValue = 0;
    let nextValue =1;
    let sum = 0;
    let index = 0;

    array[index++] = firstValue;
    if(index != n)
    {
        array[index++] = nextValue;
        for (; index < n;) {
            sum  = firstValue + nextValue;
            firstValue = nextValue;
            nextValue = sum;

            if(index == n) break;
            array[index++] = sum;
        }
    }
    
    return array;
}).protected();

server.register('fact', (n) =>{
    let result = 1;
    for (let index = 2; index <= n; index++) {
        result *= index;
    }
    return result;
}).protected();

console.log("Server running");