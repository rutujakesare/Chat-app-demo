const fs = require('fs');
const path = require('path');
const http = require('http');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    const body =[];

    if(url === '/'){
        fs.readFile('message.txt', { encoding: 'utf8'}, (err, data)=> {
            if (err) {
                console.error(err);
            }
        console.log('data from file' + data);
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write(`<body>${data}</body>`);
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    });

}
    else if (url === '/message' && method === 'POST'){
        
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log('parsedbody >>>>>',parsedBody)
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, (err) => {
                if(err){
                    console.log(err)
                }
                console.log('inside fs.writefile');
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    else{
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title><head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
}

};

const server = http.createServer(requestHandler);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});