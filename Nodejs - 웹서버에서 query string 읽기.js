// 웹서버에서 브라우저에서 요청한 query string 읽기

var http = require("http");
var url = require("url");

var app = http.createServer(function(request, response){
    var _url = request.url; // 브라우저에서 요청한 url
    var queryData = url.parse(_url, true).query; // 브라우저가 요청한 url에서 query string을 객체로 변환
    var title = queryData.id; // 읽어온 query string의 속성 중에서 id라는 속성

    if(_url === "/"){ // root경로로 접근한다면
        title = "Welcome";
    }
    if(_url === "/favicon.ico"){
        return response.writeHead(404);
    }

    response.writeHead(200);
    response.end(title);
})

app.listen(3000);