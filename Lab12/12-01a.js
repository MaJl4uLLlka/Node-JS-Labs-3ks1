const rpcWSC = require('rpc-websockets').Client;

let ws = new rpcWSC("ws://localhost:4000/");

ws.on('open',async  () =>
{
    await ws.subscribe("changed");

    ws.on("changed", () =>
    {
        console.log("File changed");
    })
})