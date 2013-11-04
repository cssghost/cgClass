var http = require("http");
var serverWrite = function (requset, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World");
};
http.createServer(serverWrite).listen(8888, "127.0.0.1");
console.log("http://127.0.0.1:8888/! OK");