// 1. hello world

// express framework를 이용하여
// 웹 서버에게 요청(request)한 브라우저에게 간단한 문구를 응답(response)하는 웹 서버를 구동시켰다.

var express = require('express');
var app = express();

app.get("/", function(request, response){
    // app.get(path, callback function(request, responese){...});
    // path로 요청이 온다면 요청 데이터 request, 응답 데이터 response를 인자값으로 한 callback function을 호출

    response.send("Hello World!!");
    // response.send(data);
    // 브라우저에게 data를 전송한다.
});

app.listen(3000);
// app.listen(port, callback function);
// 3000번 포트로 웹 서버를 구동시킨다.


/* express를 사용하지 않고 동일한 동작을 하는 web application code

var http = require("http");

var app = http.createServer(function(request, response){
    response.end("Hello World!");
});

app.listen(3000);
*/