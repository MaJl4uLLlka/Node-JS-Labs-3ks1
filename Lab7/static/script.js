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
    .then(response => { return response.text()})
    .then(str => {
        console.log(str);
        
        let XMLContainer = document.getElementById('forXML');

        let regex2 = ">";

        let newStr =str.replace(/</g, "&lt;");
        let result = newStr.replace(/>/g, "&gt;");

        console.log(result);
        XMLContainer.innerHTML = result;
    });
}

getJSON();
getXML();