const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000/wsserver');
let n = 0;
ws.onopen = ()=> {console.log('socket.onopen');
                let sendInterval = setInterval(()=> {ws.send(`10-01-client: ${++n}`)}, 3000);
                setTimeout(()=> {
                    clearInterval(sendInterval);
                    ws.close()
                }, 25000);    
};

ws.onclose = (e)=> {console.log('socket.onclose', e);};

ws.onmessage = (e) =>{ console.log('socket.onmessage', e.data)};

ws.onerror = (error) => {alert('Error '+ error.message );};