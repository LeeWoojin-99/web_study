// file list에 따라서 li태그 구성
// 읽어온 파일 목록에 따라서 html의 li태그를 구성한다.

var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    var title; // 제목
    var contents; // 내용
    var list = "<ul>"; // 리스트

    function sendData(list, title, contents, response){ // 데이터를 전송하는 함수
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
                ${list}
                <p>${contents}</p>
            </body>
            </html>
        `)
    }

    if(pathName === "/"){ // 정상적인 요청을 받았을 때 응답하는 과정
        if(queryData.id === undefined){ // query string이 없는 url이라면 home page
            title = "Home Page";
            contents = "Hello Node.js";
            fs.readdir("./nodejs_subject_list", function(err, fileList){
                for(i of fileList){
                    subject = i.split(" ")[2];
                    list += `<li><a href = "/?id=${subject}">${subject}</a></li>`
                }
                list += "</ul>\n";
                sendData(list, title, contents, response);
            })
        }else{
            title = queryData.id;
            fs.readFile(`./nodejs_subject_list/nodejs - ${queryData.id} Lorem.txt`, "utf8", function(err, description){
                fs.readdir("./nodejs_subject_list", function(err, fileList){
                    for(i of fileList){
                        subject = i.split(" ")[2];
                        list += `<li><a href = "/?id=${subject}">${subject}</a></li>`
                    }
                    list += "</ul>\n";
                    sendData(list, title, description, response);
                })
            })
        }
    }else{ // not found Page
        response.writeHead(200);
        response.end("not found");
    }
});
app.listen(3000);