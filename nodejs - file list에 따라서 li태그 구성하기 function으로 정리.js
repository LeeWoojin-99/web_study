// nodejs - file list에 따라서 li태그 구성하기 function으로 정리.js

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

    function templateHTML(list, title, body){ // HTML에 대한 template를 제작하여 반환하는 함수 함수
        return `
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
                ${body}
            </body>
            </html>
        `;
    }

    function makeFileList(fileList){ // 이름들이 담긴 배열을 인수값으로 받아서 ul태그와 각 이름에 알맞는 li태그들을 구성하는 함수
        var list = "";
        for(i of fileList){
            subject = i.split(" ")[2];
            list += `<li><a href = "/?id=${subject}">${subject}</a></li>`
        }
        list += "</ul>\n";
        return list
    }

    if(pathName === "/"){ // 정상적인 요청을 받았을 때 응답하는 과정
        if(queryData.id === undefined){ // query string이 없는 url이라면 home page
            title = "Home Page";
            contents = "Hello Node.js";
            fs.readdir("./nodejs_subject_list", function(err, fileList){
                list = makeFileList(fileList); // 읽어온 파일 목록을 ul>li 태그로 구성한 문자열을 반환
                response.writeHead(200); // 정상적인 서버의 응답임을 표시
                response.end(templateHTML(list, title, `<p>${contents}</p>`)); // title, contents, list를 기반으로 html에 대한 template를 작성하여 전송
            })
        }else{
            title = queryData.id;
            fs.readFile(`./nodejs_subject_list/nodejs - ${queryData.id} Lorem.txt`, "utf8", function(err, description){
                fs.readdir("./nodejs_subject_list", function(err, fileList){
                    list = makeFileList(fileList);
                    contents = description
                    response.writeHead(200);
                    response.end(templateHTML(list, title, `<p>${contents}</p>`));
                })
            })
        }
    }else{ // not found Page
        response.writeHead(200);
        response.end("not found");
    }
});
app.listen(3000);