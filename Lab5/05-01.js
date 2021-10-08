const http       = require('http');
const fs         = require('fs');
const url        = require('url');
let   data       = require('./db');
const { SlowBuffer } = require('buffer');

//-----------------------------------------------------------------

let serverCommands = {
    SD: 'sd',
    SC: 'sc',
    SS: 'ss'
}

let shutdownTimer  = null;
let fixationTimer  = null;
let statisticTimer = null;

let isShutdownTimerActive  = false;
let isFixationTimerActive  = false;
let isStatisticTimerActive = false;
 
let serverStatistic = {
    start  : null,
    finish : null,
    request: 0,
    commit : 0
}

let lastServerStatistic = {};

let tempServerStatistic = Object.assign({},serverStatistic);

let db = new data.DB();

//----------------------------------------------------------------

db.on('GET',  (req,resp)=>{
    setImmediate(() =>
    {
        resp.end(JSON.stringify(db.select()));
    })
})

db.on('POST', (req,resp)=>{

    setImmediate(() =>
    {
        req.on('data', data=>{
        let r = JSON.parse(data);
        db.insert(r);
        resp.end(JSON.stringify(r));
        });
    })
});

db.on('PUT',  (req, resp) => {

    setImmediate(() =>
    {
        req.on('data', data => {
        let r = JSON.parse(data);
        resp.end(JSON.stringify(db.update(r)) );
        })
    })
});

db.on("DELETE",  (req, resp) => {

    setImmediate(() =>
    {
        if( typeof url.parse(req.url, true).query.id != 'undefined')
        {
            let id = parseInt(url.parse(req.url, true).query.id);
            if(Number.isInteger(id))
            {
                resp.end( JSON.stringify(db.delete(id)) );
            }
        }
    })
});

db.on('COMMIT', () => {
    
    setImmediate(() => 
    {
        if(isStatisticTimerActive) tempServerStatistic.commit ++;
        db.commit();
    });
})

//--------------------------------------------------------------------------------


let server = http.createServer( function (request, response)
{
    if( isStatisticTimerActive ) tempServerStatistic.request ++;

    switch(url.parse(request.url).pathname)
    {
        case '/':
            let html = fs.readFileSync('./04-02.html');
            response.writeHead(200, {'Content-Type':'text/html; charset = utf-8'});
            response.end(html);
        break;

        case '/style.css' :
            let cssFile = fs.readFileSync("./style.css");
            response.writeHead(200, {"Content-Type": "text/css"});
            response.end(cssFile);
        break;

        case '/api/db':
           db.emit(request.method, request, response);
        break;

        case '/api/ss':
            response.end(JSON.stringify(lastServerStatistic));
        break;

        default:
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end('<h1>Not found</h1>');        
        break;
    }
}
).listen(5000, () => { process.stdout.write('--> ');});

//---------------------------------------------------------------------------------

console.log("Server running at http://localhost:5000/");

process.stdin.setEncoding('utf-8');

process.stdin.on('readable', () => {
   
    let chunk = null;
    while((chunk = process.stdin.read()) != null)
    {
        let space = ' ';
        let regex = new RegExp( `${space}+` );
        let command = chunk.trim().split(regex,2);

        let seconds = command.length === 2 ? parseInt(command[1]) : null;
        
        switch( command[0] )
        {
            case serverCommands.SD :
                if(command.length === 2)
                {
                    if( !Number.isInteger(seconds))
                    {
                        console.log('A second parameter must be an integer');
                        break;
                    }

                    setShutdown(seconds);
                }
                else
                {
                    if( isShutdownTimerActive )
                    {
                        clearTimeout(shutdownTimer);
                        isShutdownTimerActive = false;
                    }
                }
                break;

            case serverCommands.SC :
                if(command.length === 2)
                {
                    if( !Number.isInteger(seconds))
                    {
                        console.log('A second parameter must be an integer');
                        break;
                    }

                    setFixation(seconds);
                }
                else
                {
                    if( isFixationTimerActive )
                    {
                        clearInterval(fixationTimer);
                        isFixationTimerActive = false;
                    }
                }
                break;

            case serverCommands.SS :
                if(command.length === 2)
                {
                    if( !Number.isInteger(seconds))
                    {
                        console.log('A second parameter must be an integer');
                        break;
                    }
                    
                    setStatTimer(seconds);
                }
                else
                {
                    if(isStatisticTimerActive)
                    {
                        clearTimeout(statisticTimer);
                        resetStatistic();
                        lastServerStatistic = {};
                        isStatisticTimerActive = false;
                    }
                }
                break;

            default :
                console.log('Unknow commmand');
                break;
        }

        process.stdout.write('--> ');
    }
})

//----------------------------------------------------------------

function resetStatistic()
{
    tempServerStatistic.start   = null;
    tempServerStatistic.finish  = null;
    tempServerStatistic.request = 0,
    tempServerStatistic.commit  = 0;
}

function endStatistic()
{
    isStatisticTimerActive = false;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day  = date.getDate();

    tempServerStatistic.finish = `${year}-${month < 10 ? '0'+ month: month}-${day < 10 ? '0' + day: day }`;
    lastServerStatistic = Object.assign({},tempServerStatistic);
}

function setShutdown( seconds )
{
    if(isShutdownTimerActive)
    {
        clearTimeout(shutdownTimer);
    }

    shutdownTimer = setTimeout(() =>
        {
            process.stdout.unref();
            process.stdin.unref();
            server.unref();
            server.close();
        },
         seconds * 1000);

    isShutdownTimerActive = true;
}

function setFixation( seconds )
{
    if(isFixationTimerActive)
    {
        clearInterval(fixationTimer);
    }
    
    fixationTimer = setInterval(() =>
    {
        db.emit('COMMIT');
    },
    seconds * 1000);

    fixationTimer.unref();

    isFixationTimerActive = true;
}

function setStatTimer( seconds )
{
    if(isStatisticTimerActive)
    {
        clearTimeout(statisticTimer);
        
    }

    lastServerStatistic = {};
    resetStatistic();

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day  = date.getDate();

    tempServerStatistic.start = `${year}-${month < 10 ? '0'+ month: month}-${day < 10 ? '0' + day: day }`;

    statisticTimer = setTimeout(() => 
    {
        endStatistic();
    }, seconds * 1000);

    statisticTimer.unref();
    isStatisticTimerActive = true;
}


