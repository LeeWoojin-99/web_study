// noedjs - 글 수정 UI 생성
// 기존의 제목, 바꾼 제목, 바꾼 내용을 전송하는 UI를 만들었다.
// 기존의 제목은 전송할 때만 사용되고 사용자는 사용하지 않기 때문에 type속성의 값을 hidden으로 주었다.

var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    var title; // 제목
    var contents; // 내용
    var list = ""; // 리스트

    function templateHTML(list, title, body, control){ // HTML에 대한 template를 제작하여 반환하는 함수 함수
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
                ${control}
                ${body}
            </body>
            </html>
        `;
    }

    function makeFileList(fileList){ // 이름들이 담긴 배열을 인수값으로 받아서 ul태그와 각 이름에 알맞는 li태그들을 구성하는 함수
        var list = "<ul>\n";
        for(i of fileList){
            list += `${" ".repeat(4).repeat(5)}<li><a href = "/?id=${i}">${i}</a></li>\n`
        }
        list += `${" ".repeat(4).repeat(4)}</ul>\n`;
        return list
    }

    if(pathName === "/"){ // home page로 왔을 때
        if(queryData.id === undefined){ // query string이 없는 url이라면 home page
            title = "Home Page";
            contents = "Hello Node.js";
            fs.readdir("./nodejs_data", function(err, fileList){
                list = makeFileList(fileList); // 읽어온 파일 목록을 ul>li 태그로 구성한 문자열을 반환
                response.writeHead(200); // 정상적인 서버의 응답임을 표시
                response.end(templateHTML(list, title,
                    `<p>${contents}</p>`,
                    `<a href="./create">create page</a>`
                )); // title, contents, list, control를 기반으로 html에 대한 template를 작성하여 전송
            })
        }else{ // query string이 있는 url이라면 해당 페이지를 생성
            title = queryData.id;
            fs.readFile(`./nodejs_data/${queryData.id}`, "utf8", function(err, description){
                contents = description;
                fs.readdir("./nodejs_data", function(err, fileList){
                    list = makeFileList(fileList);
                    response.writeHead(200);
                    response.end(templateHTML(list, title,
                        `<p>${contents}</p>`,
                        `<a href="./create">create page</a> <a href="./update?id=${title}">update</a>`
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
            list = makeFileList(fileList);
            response.writeHead(200);
            response.end(templateHTML(list, title, `<p>${contents}</p>`, ``));
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
            contents = post.description;
            fs.writeFile(`nodejs_data/${title}`, contents, "utf8", function(err){
                response.writeHead(302, {Location : `/?id=${title}`});
                // 서버가 응답을 마치면 Location의 값으로 사용자를 보낸다.
                // 301 : 페이지가 완전히 이전되었습니다
                // 302 : 리다이렉션
                // redirection : 어떠한 처리를 한 후에 사용자를 다른 페이지로 튕겨버리는 것을 리다이렉션이라고 한다.
                response.end();
            })
        })
    }else if(pathName === "/update"){ // 글 수정 UI 페이지를 만드는 부분
        title = `${queryData.id}`;
        fs.readFile(`./nodejs_data/${queryData.id}`, "utf8", function(err, description){
            contents = `
            <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}"><br>
                <input type="text" name="title" placeholder="title" value="${title}"><br>
                <textarea name="description" placeholder="description">${description}</textarea><br>
                <input type="submit">
            </form>
            `;
            fs.readdir("./nodejs_data", function(err, fileList){
                list = makeFileList(fileList);
                response.writeHead(200);
                response.end(templateHTML(list, `${queryData.id}`, `<p>${contents}</p>`, ``));
            })
        })
    }else{ // not found Page
        response.writeHead(200);
        response.end("not found");
    }
});
app.listen(3000);