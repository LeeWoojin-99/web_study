// 웹서버에서 readFile로 파일 읽기

var http = require("http");
var fs = require("fs");

var app = http.createServer(function(request, response){
    var _url = request.url;
    _url = decodeURI(_url); // 공백이 포함된 url은 encoding과정에서 공백이 %20으로 바뀌기 때문에 그것을 방지하기 위한 디코딩 작업

    if(_url === "/favicon.ico"){
        return response.writeHead(404);
    }

    response.writeHead(200);

    fs.readFile(_url.substr(1), "utf8", function(err, data){ // 경로 입력 부분의 처음에 "/"가 없어야 한다.
        response.end(data);
    })
})
app.listen(3000);