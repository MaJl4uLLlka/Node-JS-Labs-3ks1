const async = require('async');
const rpcWSC = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');
let h = (x = ws) => async.parallel({
    square:   (cb) => {ws.call('square', [3]).then((r) => cb(null,"square( 3 ) = "+ r)).catch(error => cb(error, null));},
    square54: (cb) => {ws.call('square', [5,4]).then((r) => cb(null,"square( 5,4 ) = "+ r)).catch(error => cb(error, null));},
    sum2:     (cb) => {ws.call('sum', [2]).then((r) => cb(null,"sum( 2 ) = " + r)).catch(error => cb(error, null));},
    sumN:     (cb) => {ws.call('sum', [2,4,6,8,10]).then((r) => cb(null,"sum( 2,4,6,8,10 ) = "+ r)).catch(error => cb(error, null));},
    mul3:     (cb) => {ws.call('mul', [3]).then((r) => cb(null,"mul( 3 ) = "+r)).catch(error => cb(error, null));},
    mulN:     (cb) => {ws.call('mul', [3,5,7,9,11,13]).then((r) => cb(null, "mul( 3,5,7,9,11,13 ) = " + r)).catch(error => cb(error, null));},
    fib1:     (cb) => {ws.login({login: 'kkv', password: '456'})
    .then((login) =>
    {
        if(login)
        {
            ws.call('fib', 1).then((r) => cb(null,'fib( 1 ) = '+r)).catch(error => cb(error, null));
        }
        else cb(null,'login error');
    }) },
    fib2: (cb) => {ws.login({login: 'kkv', password: '456'})
    .then((login) =>
    {
        if(login)
        {
            ws.call('fib', 2).then((r) => cb(null,'fib( 2 ) = '+r)).catch(error => cb(error, null));
        }
        else cb(null,'login error');
    }) },
    fib7: (cb) => {ws.login({login: 'kkv', password: '456'})
    .then((login) =>
    {
        if(login)
        {
            ws.call('fib', 7).then((r) => cb(null,'fib( 7 ) = '+r)).catch(error => cb(error, null));
        }
        else cb(null,'login error');
    }) },
    fact0: (cb) => {ws.login({login: 'kkv', password: '456'})
    .then((login) =>
    {
        if(login)
        {
            ws.call('fact', 0).then((r) => cb(null,'fact( 0 ) = '+r)).catch(error => cb(error, null));
        }
        else cb(null,'login error');
    }) },

    fact5: (cb) => {ws.login({login: 'kkv', password: '456'})
    .then((login) =>
    {
        if(login)
        {
            ws.call('fact', 5).then((r) => cb(null,'fact( 5 ) = '+r)).catch(error => cb(error, null));
        }
        else cb(null,'login error');
    }) },
    fact10: (cb) => {ws.login({login: 'kkv', password: '456'})
    .then((login) =>
    {
        if(login)
        {
            ws.call('fact', 10).then((r) => cb(null,'fact( 10 ) = '+r)).catch(error => cb(error, null));
        }
        else cb(null,'login error');
    }) }
},
(error, result) =>{
    if(error) console.log(error);
    else console.log(result);
    ws.close();
});

ws.on('open', h);