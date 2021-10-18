const { rejects } = require('assert');
const { error } = require('console');
const fs   = require('fs');
const path = require('path');
const { resolve } = require('path/posix');

let staticDirectory = '.';

function init(relativePath)
{
    staticDirectory = relativePath;
    
    return {
        getFile: getFile
    } ;
}

async function getFile(filepath)
{
    let fullPath = staticDirectory + filepath;
    console.log(fullPath);

    return new Promise((resolve, reject) =>
    {
        let result = {
            contentLength: null,
            MIME: null,
            fileContent: null,
            isImageOrVideo:  false,
            isJSON: false,
        };

        fs.stat(fullPath, (err, stat) => 
            {
                if(err == null) 
                {
                    result.contentLength = stat.size;
    
                    switch(path.extname(fullPath))
                    {
                        case '.html':
                            result.MIME = "text/html";
                            break;
                    
                        case '.css':
                            result.MIME = "text/css";
                            break;
                    
                        case '.js':
                            result.MIME = "text/javascript";
                            break;
                    
                        case '.png':
                            result.MIME = "image/png";
                            result.isImageOrVideo = true;
                            break;
                    
                        case '.docx':
                            result.MIME = "application/msword";
                            break;
                    
                        case '.json':
                            result.isJSON = true;
                            result.MIME = "application/json";
                            result.fileContent= require(fullPath);
                            break;
                    
                        case '.xml':
                            result.MIME = "application/xml";
                            break;
                    
                        case '.mp4':
                            result.MIME = "video/mp4";
                            result.isImageOrVideo = true;
                            break;
                    
                        default:
                            reject( new Error("This file extention isn't supported"));
                            break;
                    }

                    if(!result.isJSON)
                    {
                        result.fileContent = fs.readFileSync(fullPath);
                    }
                    
                    resolve(result);
                }
                else if(err.code == 'ENOENT')
                {
                    reject(new Error("File does not exist"));
                }
                else
                {
                    reject(new Error(err.code));
                }
    
            }
        );
    })
            
} 

module.exports = init;
module.exports.getFile = getFile;