// noedjs - 출력 정보에 대한 보안

// 출력하기 전에 위험할 수 있는 데이터를 필터링하여 안전한 데이터로 만든 후에 출력하는 것이 중요하다.

// 필터링하는 작업을 도와주는 sanitize-html이라는 api가 있다.
// npm install -s sanitize-html
// npm init

// 사용 방법
// var sanitizeHtml = require("sanitize-html");
// var dirty = "some really tacky HTML";
// var clean = sanitizeHtml(dirty);

var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var template = require("../../Study Codes/nodejs - template module (CSS).js");
var path = require("path");
var sanitizeHtml = require("sanitize-html");
// var sanitizedTitle = sanitizeHtml(title);
// var sanitizedDescription = sanitizeHtml(description);

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    var title; // 제목
    var contents; // 내용
    var list = ""; // 리스트

    if(pathName === "/"){ // home page로 왔을 때
        if(queryData.id === undefined){ // query string이 없는 url이라면 home page
            title = "Home Page";
            contents = "Hello Node.js";
            fs.readdir("./nodejs_data", function(err, fileList){
                list = template.makeFileList(fileList); // 읽어온 파일 목록을 ul>li 태그로 구성한 문자열을 반환
                response.writeHead(200); // 정상적인 서버의 응답임을 표시
                response.end(template.html(list, title,
                    `<p>${contents}</p>`,
                    `<a href="./create" class="controlBtn">Create</a>`
                )); // title, contents, list, control를 기반으로 html에 대한 template를 작성하여 전송
            })
        }else{ // query string이 있는 url이라면 해당 페이지를 생성
            title = queryData.id;
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`./nodejs_data/${filteredId}`, "utf8", function(err, description){
                var sanitizedTitle = sanitizeHtml(title);
                var sanitizedDescription = sanitizeHtml(description);
                fs.readdir("./nodejs_data", function(err, fileList){
                    list = template.makeFileList(fileList);
                    response.writeHead(200);
                    response.end(template.html(list, sanitizedTitle,
                        `<p>${sanitizedDescription}</p>`,
                        `
                        <ul id="controlBtnList">
                            <a href="./create" class="controlBtn">Create</a> <a href="./update?id=${sanitizedTitle}" class="controlBtn">Update</a>
                            <form action="/delete_process" method="POST" class="controlBtn">
                                <input type="hidden" name="id" value="${sanitizedTitle}">
                                <input type="submit" value="Delete" >
                            </form>
                        </ul>
                        `
                    ));
                })
            })
        }
    }else if(pathName === "/create"){ // 글 생성 UI 페이지를 만드는 부분
        title = "Create Page";
        contents = `
        <form action="/create_process" method="post">
            <input type="text" name="title" placeholder="title"><br>
            <textarea name="description" placeholder="description"></textarea><br>
            <input type="submit">
        </form>
        `;
        fs.readdir("./nodejs_data", function(err, fileList){
            list = template.makeFileList(fileList);
            response.writeHead(200);
            response.end(template.html(list, title, `${contents}`, ``));
        })
    }else if(pathName === "/create_process"){ // 생성된 데이터를 받아서 처리하는 부분
        var body = "";
        request.on("data", function(data){
            body += data;
        })
        request.on("end", function(){ // data를 모두 받아왔을 때 실행되는 부분
            // console.log(body); // query string의 형태로 데이터를 받아왔다.
            // ex) title=abc&description=a+b+c+d+e
            var post = qs.parse(body); // qs(query string)의 메서드 parse를 이용하여 query string data를 js object data로 변환한다.
            // console.log(post); // web browser에서 web server로 보내서 받아진 query string data가 javascript object data로 변환된 데이터이다.
            title = post.title;
            description = post.description;
            var filteredId = path.parse(title).base;
            fs.writeFile(`nodejs_data/${filteredId}`, description, "utf8", function(err){
                response.writeHead(302, {Location : `/?id=${filteredId}`});
                // 서버가 응답을 마치면 Location의 값으로 사용자를 보낸다.
                // 301 : 페이지가 완전히 이전되었습니다
                // 302 : 리다이렉션
                // redirection : 어떠한 처리를 한 후에 사용자를 다른 페이지로 튕겨버리는 것을 리다이렉션이라고 한다.
                response.end();
            })
        })
    }else if(pathName === "/update"){ // 글 수정 UI 페이지를 만드는 부분
        title = `${queryData.id}`;
        var filteredId = path.parse(title).base;
        fs.readFile(`./nodejs_data/${filteredId}`, "utf8", function(err, description){
            contents = `
            <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}"><br>
                <input type="text" name="title" placeholder="title" value="${title}"><br>
                <textarea name="description" placeholder="description">${description}</textarea><br>
                <input type="submit">
            </form>
            `;
            fs.readdir("./nodejs_data", function(err, fileList){
                list = template.makeFileList(fileList);
                response.writeHead(200);
                response.end(template.html(list, `${queryData.id}`, `${contents}`, ``));
            })
        })
    }else if(pathName === "/update_process"){ // 글 수정 처리를 하는 부분
        var body = "";
        request.on("data", function(data){
            body += data;
        })
        request.on("end", function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            var filteredId = path.parse(id).base;

            fs.rename(`nodejs_data/${filteredId}`, `nodejs_data/${title}`, function(err){
                // 파일의 이름을 변경
                fs.writeFile(`nodejs_data/${title}`, description, "utf8", function(err){
                    // 변경된 이름의 파일의 내용을 변경
                    response.writeHead(302, {Location: `/?id=${title}`});
                    // 변경 후에는 해당 위치로 이동
                    response.end();
                })
            })
        })
    }else if(pathName === "/delete_process"){ // 삭제 처리 부분
        var body = "";
        request.on("data", function(data){
            body += data;
        })
        request.on("end", function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;

            fs.unlink(`nodejs_data/${filteredId}`, function(err){
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        })
    }else{ // not found Page
        response.writeHead(200);
        response.end("not found");
    }
});
app.listen(3000);