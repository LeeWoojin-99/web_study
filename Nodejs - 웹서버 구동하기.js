// Nodejs로 웹서버 구동하기

var http = require("http"); // 변수명 http라는 이름으로 nodejs의 module 중에서 http라는 module을 사용하겠다고 선언

var app = http.createServer(function(request, response){ // 웹서버를 만드는 과정
    // 브라우저가 웹서버에게 요청하면 웹서버가 브라우저에게 응답해준다.
    response.writeHead(200);
    response.end("hello nodejs web server !!"); // 서버가 브라우저에게 응답할 데이터를 설정
})

app.listen(3000); // 3000번 PORT를 사용하여 웹서버를 구동