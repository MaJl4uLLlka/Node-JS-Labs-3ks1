const async = require('async');
const rpcWSC = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');
let h = () => async.waterfall([
    (cb) => {ws.login({login: 'kkv', password: '456'})
    .then((login) =>
    {
        if(login)
        {
            ws.call('fib', 7).then((r) => cb(null, r)).catch(error => cb(error, null));
        }
        else cb(null,'login error');
    }) },
    (p,cb) => {ws.call('sum', p).then((r) => cb(null,r)).catch(error => cb(error, null));},
    (p,cb) => {ws.call('mul',  [p,2,4,6]).then((r) => cb(null, r)).catch(error => cb(error, null));},
    (p,cb) => {ws.call('square',  [3]).then((r) => cb(null, p + r)).catch(error => cb(error, null))},
    (p,cb) => {ws.call('square',  [5,4]).then((r) => cb(null,p + r)).catch(error => cb(error, null))},
    (p,cb) => {ws.call('mul',  [3,5,7,9,11,13]).then((r) => cb(null, p + r)).catch(error => cb(error, null))}
], (e,r) => {
    if(e) console.log(e);
    else console.log(r);
    ws.close();
});

ws.on('open', h);

