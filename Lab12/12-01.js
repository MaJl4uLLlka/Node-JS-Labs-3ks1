const http = require('http');
const url = require('url');
const fs = require('fs');
const rpcWSS = require('rpc-websockets').Server;

const WebSocketServer = new rpcWSS({port:4000, host: 'localhost', path: '/'});
WebSocketServer.event("changed");

let server = http.createServer((req, resp) =>
{
    let urlParts = url.parse(req.url).pathname.split('/');
    urlParts.splice(0,1);
    console.log(urlParts);
    switch(req.method)
    {
        case 'GET':
            switch(urlParts[0])
            {
                case '':
                    let studentList = JSON.parse(fs.readFileSync('./students/StudentList.json'));
                    resp.writeHead(200, {'Content-Type': 'application/json'});
                    resp.end(JSON.stringify(studentList));
                    break;

                case 'backup':
                    let json = [];
                    fs.readdir('./students', {withFileTypes: true}, (err, files) =>
                    {
                        if(err) console.log(err);
                        else
                        {
                            for (let index = 0; index < files.length; index++) {
                                if(files[index].name === "StudentList.json")
                                {
                                    continue;
                                }
                                else
                                {
                                    let obj = {index: index,name: files[index].name};
                                    json.push(obj);
                                }
                            }

                            resp.end(JSON.stringify(json));
                        }
                    })
                    break;

                default:
                    let n = parseInt(urlParts[0]);

                    if(Number.isInteger(n))
                    {
                        let studentList = JSON.parse(fs.readFileSync('./students/StudentList.json'));
                        let desiredStudent = null;
                        for(let student of studentList)
                        {
                            if(student.id === n)
                            {
                                desiredStudent = student;
                                break;
                            }
                        }
                        resp.writeHead(200, {'Content-Type': 'application/json'});
                        if(desiredStudent === null)
                        {
                            resp.end(JSON.stringify({error: 2, message:`Студент с id равным ${n} не найден`}));
                        }
                        else
                        {
                            resp.end(JSON.stringify(desiredStudent));
                        }
                    }
                    else
                    {
                        resp.writeHead(404, {"Content-Type":'text/html; charset=utf-8'});
                        resp.end();
                    }
                    break;
            }
            break;
        
        case 'POST':
            switch(urlParts[0])
            {
                case '':
                    req.on('data', data =>
                    {
                        let studentList = JSON.parse(fs.readFileSync('./students/StudentList.json'));
                        newStudent = JSON.parse(data);
                        for (const student of studentList) {
                            if(newStudent.id === student.id)
                            {
                                resp.writeHead(400, {'Content-Type': 'application/json'})
                                resp.end(JSON.stringify({error: 3, message: `Студент с id равным ${newStudent.id} уже есть`}));
                                return;
                            }
                        }

                        studentList.push(newStudent);
                        fs.writeFile('./students/StudentList.json', JSON.stringify(studentList), (e) =>
                        {
                            if(e) console.log(e);
                            else
                            {
                                resp.end(JSON.stringify(newStudent));
                            }
                        });
    
                    });
                    break;

                case 'backup':
                    setTimeout( ()=>
                    {
                        let date = new Date();
                        let year = ''+date.getFullYear();
                        let month = (date.getMonth()+1) < 10? '0'+(date.getMonth()+1):''+ (date.getMonth()+1);
                        let day = date.getDate() < 10? '0'+date.getDate():'' + date.getDate();
                        let hours = date.getHours() < 10? '0' + date.getHours():''+ date.getHours();
                        let seconds = date.getSeconds() < 10? '0'+date.getSeconds():''+ date.getSeconds();
                        fs.copyFile('./students/StudentList.json',`./students/${year}${month}${day}${hours}${seconds}_StudentList.json`,(e) =>
                        {
                            if(e) console.log(e);
                            else
                            {
                                fs.watch(`./students/${year}${month}${day}${hours}${seconds}_StudentList.json`, (event, file) =>
                                {
                                    if(file && event === 'change')
                                    {
                                        WebSocketServer.emit("changed");
                                    }
                                });
                                resp.end();
                            }
                        })
                    }, 2000)
                    break;

                default:
                    resp.writeHead(404, {"Content-Type":'text/html; charset=utf-8'});
                    resp.end();
                    break;
            }
            break;
        
        case 'PUT':
            if(url.parse(req.url).pathname === '/')
            {
                req.on('data', data =>
                    {
                        let isFound = false;
                        let studentList = JSON.parse(fs.readFileSync('./students/StudentList.json'));
                        let newStudent = JSON.parse(data);
                        for (let i = 0; i < studentList.length; i++) {
                            if(newStudent.id === studentList[i].id)
                            {
                                studentList[i].name = newStudent.name;
                                studentList[i].bday = newStudent.bday;
                                studentList[i].specility = newStudent.specility;
                                isFound = true;
                                break;
                            }
                        }

                        if(!isFound)
                        {
                            resp.writeHead(400, {'Content-Type': 'application/json'})
                            resp.end(JSON.stringify({error: 2, message: `Студент с id равным ${newStudent.id} не найден`}));
                            return;
                        }

                        fs.writeFile('./students/StudentList.json', JSON.stringify(studentList), (e) =>
                        {
                            if(e) console.log(e);
                            else
                            {
                                resp.end(JSON.stringify(newStudent));
                            }
                        });
    
                    });
            }
            else 
            {
                resp.writeHead(404, {"Content-Type":'text/html; charset=utf-8'});
                resp.end();
            }
            break;
        
        case 'DELETE':
            switch(urlParts[0])
            {
                case 'backup':
                    let year = urlParts[1].slice(0,4);
                    let month = urlParts[1].slice(4,6);
                    let day = urlParts[1].slice(6,8);
                    
                    let date = new Date(`${month} ${day} ${year}`);

                    fs.readdir('./students', {withFileTypes: true}, (err, files) =>
                    {
                        if(err) console.log(err);
                        else
                        {
                            for (let index = 0; index < files.length; index++) {
                                if(files[index].name === "StudentList.json")
                                {
                                    continue;
                                }
                                else
                                {
                                    fs.stat(`./students/${files[index].name}`, (err, stats) =>
                                    {
                                        if(err) console.log(err);
                                        else
                                        {
                                            if(stats.birthtime < date)
                                            {
                                                fs.unlink(`./students/${files[index].name}`, (e) =>
                                                {
                                                    if(e) console.log(e);
                                                    else console.log('File deleted');
                                                });
                                            }
                                        }
                                    } )
                                }
                            }
                        }
                    })

                    resp.end();
                    break;

                default:
                    let n = parseInt(urlParts[0]);

                    if(Number.isInteger(n))
                    {
                        let studentList = JSON.parse(fs.readFileSync('./students/StudentList.json'));
                        let desiredStudent = null;
                        for(let i=0; i < studentList.length; i++)
                        {
                            if(studentList[i].id === n)
                            {
                                desiredStudent = studentList[i];
                                studentList.splice(i,1);
                                fs.writeFile('./students/StudentList.json', JSON.stringify(studentList), (e) =>
                                {
                                    if(e) console.log(e);
                                    else
                                    {
                                        resp.end(JSON.stringify(desiredStudent));
                                    }
                                });
                                break;
                            }
                        }
                        resp.writeHead(200, {'Content-Type': 'application/json'});
                        if(desiredStudent === null)
                        {
                            resp.end(JSON.stringify({error: 2, message:`Студент с id равным ${n} не найден`}));
                        }
                        else
                        {
                            resp.end(JSON.stringify(desiredStudent));
                        }
                    }
                    else
                    {
                        resp.writeHead(404, {"Content-Type":'text/html; charset=utf-8'});
                        resp.end();
                    }
                    break;
            }
            break;

        default: 
        resp.writeHead(405, 'Not supported', {'Content-Type':'text/html; charset= utf-8'})
        resp.end();
        break;
    }
}).listen(5000);

console.log("Server running at http://localhost:5000/");

