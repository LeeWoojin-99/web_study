// home page 구현

// nodejs - 웹서버에서 query string에 따라서 다른 html문서 만들기.js 의 다음 단계입니다.
// 기존에는 query string으로 HTML, CSS, JavaScript가 오면 알맞는 페이지를 보여줬지만
// query string이 없는 페이지를 브라우저가 서버에게 요청하면 알맞지 못한 페이지가 보여졌습니다.
// 그래서 query string이 없는 페이지를 요청받더라도 서버는 알맞는 페이지를 보여줄 수 있게 한 js파일입니다.

var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    var title; // 제목
    var contents; // 내용

    function sendData(title, contents, response){ // 데이터를 전송하는 함수
        response.writeHead(200);
        response.end(`
            <!--  -->
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
                <title>${title}</title>
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                <h2>${title}</h1>
                <ul>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>
                <p>${contents}</p>
            </body>
            </html>
        `)
    }

    if(pathName === "/"){ // 정상적인 요청을 받았을 때 응답하는 과정
        if(queryData.id === undefined){ // query string이 없는 url이라면 home page
            title = "Home Page";
            contents = "Hello Node.js";
            sendData(title, contents, response);
        }else{
            title = queryData.id;
            fs.readFile(`nodejs - ${queryData.id} Lorem.txt`, "utf8", function(err, description){
                sendData(title, description, response);
                // if 참과 거짓에서 공통적으로 데이터를 전송해야 하는 부분이 필요하기 때문에 함수 sendData로 만들어서 사용
            })
        }
    }else{ // not found Page
        response.writeHead(200);
        response.end("not found");
    }
})
app.listen(3000);