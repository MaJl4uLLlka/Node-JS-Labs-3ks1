
function getJSON()
{
    fetch('http://localhost:5000/static/info.json',{
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {return response.json();})
    .then(data => 
        {
            console.log(data);
            let JSONcontainer = document.getElementById('forJSON');
            JSONcontainer.innerHTML = '';
            JSONcontainer.innerHTML += `{ type: ${data.type}, version: ${data.version}, limit: ${data.limit} }`
        });
}

function getXML()
{
    fetch('http://localhost:5000/static/bookstore.xml',{
        method: 'GET',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        }})
    .then(response => {response.text()})
    .then(str => {
        console.log(str);
        (new window.DOMParser()).parseFromString(str, "text/xml");
    })
    .then(data =>
        {
            let XMLContainer = document.getElementById('forXML');
            XMLContainer.innerHTML = data;
        });
}

getJSON();
getXML();