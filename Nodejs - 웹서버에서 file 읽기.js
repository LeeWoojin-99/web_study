// 웹서버에서 file 읽기

var http = require("http");
var fs = require("fs");

var app = http.createServer(function(request, response){
    var _url = request.url;
    _url = decodeURI(_url); // 공백이 포함된 url은 encoding과정에서 공백이 %20으로 바뀌기 때문에 그것을 방지하기 위한 디코딩 작업

    if(_url === "/favicon.ico"){
        return response.writeHead(404);
    }

    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + _url));
    // fs.readFileSync(x) : x라는 파일을 읽어온다.
})
app.listen(3000);