const { error } = require('console');

const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', () =>
{
    ws.call('square', [3]).then((r) => console.log("square( 3 ) = ", r)).catch(error => console.log(error));
    ws.call('square', [5,4]).then((r) => console.log("square( 5,4 ) = ", r)).catch(error => console.log(error));
    ws.call('sum', [2]).then((r) => console.log("sum( 2 ) = ", r)).catch(error => console.log(error));
    ws.call('sum', [2,4,6,8,10]).then((r) => console.log("sum( 2,4,6,8,10 ) = ", r)).catch(error => console.log(error));
    ws.call('mul', [3]).then((r) => console.log("mul( 3 ) = ", r)).catch(error => console.log(error));
    ws.call('mul', [3,5,7,9,11,13]).then((r) => console.log("mul( 3,5,7,9,11,13 ) = ", r)).catch(error => console.log(error));

    ws.login({login: 'kkv', password: '456'})
    .then((login) =>
    {
        if(login)
        {
            ws.call('fib', 1).then((r) => console.log('fib( 1 ) = ', r)).catch(error => console.log(error));
            ws.call('fib', 2).then((r) => console.log('fib( 2 ) = ', r)).catch(error => console.log(error));
            ws.call('fib', 7 ).then((r) => console.log('fib( 7 ) = ', r)).catch(error => console.log(error));
            ws.call('fact', 0 ).then((r) => console.log('fact( 0 ) = ', r)).catch(error => console.log(error));
            ws.call('fact', 5 ).then((r) => console.log('fact( 5 ) = ', r)).catch(error => console.log(error));
            ws.call('fact', 10 ).then((r) => console.log('fact( 10 ) = ', r)).catch(error => console.log(error));
        
        
        }
        else console.log('login error');
    }) 
});