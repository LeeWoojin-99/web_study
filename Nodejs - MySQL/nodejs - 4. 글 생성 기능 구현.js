// nodejs - 4. 글 생성 기능 구현

// 글을 생성 페이지와 글을 생성하는 기능을 MySQL과 연계하여 구현하였다.

// template module에서 a태그의 href값이 i로 되어있던 것을
// fileList[i].id로 바꿔주었다.

// 글 생성 기능 구현 :
// INSERT INTO topic (title, description, created, author_id) VALUES(title, description, NOW(), 1)
// 위에서 VALUES()안에 들어있는 변수 title과 description은
// 서버가 브라우저로부터 받은 query string 데이터를 js의 객체 데이터로 변환한 데이터의 속성값 중 하나이다.
// var post = qs.parse(body); // 브라우저로부터 받은 query string data를 js object data로 변환한다.
// title = post.title;
// description = post.description;

var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
// html의 form 태그에서 서버로 보내는 데이터가 query string 형태의 데이터이기 때문에 받아온 데이터를 js의 객체 형태로 변환해주는 기능을 사용하기 위한 'querystring' 모듈
var template = require("./nodejs - template module (MySQL).js"); // html code를 만들어주는 메서드가 담긴 모듈
var path = require("path");
// var filteredId = path.parse(queryData.id).base;
// 사용자가 query string의 값으로 보안에 위협이 되는 값을 줄 수 있기 때문에 안전한 값만을 추출하기 위한 path module
var sanitizeHtml = require("sanitize-html");
var mysql = require("mysql");
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lwj1316",
    database: "opentutorials"
});
db.connect();

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    var title; // 제목
    var contents; // 내용
    var list; // 리스트

    if(pathName === "/"){ // home page로 왔을 때
        if(queryData.id === undefined){ // query string이 없는 url이라면 home page

            /*
            file system code
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
            */

            // MySQL database code
            title = "Home Page";
            contents = "Hello Node.js";
            db.query(`SELECT * FROM topic`, function(error, titles){
                if(error) throw error;
                list = template.makeFileList(titles);
                response.writeHead(200);
                response.end(template.html(list, title,
                    `<p>${contents}</p>`,
                    `
                    <ul id="controlBtnList">
                        <a href="./create" class="controlBtn">Create</a>
                    </ul>
                    `
                ));
            });
        }else{ // query string이 있는 url이라면 해당 페이지를 생성

            /*
            file system code
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
            */
            
            // MySQL database code
            var filteredId = path.parse(queryData.id).base;
            db.query(`SELECT * FROM topic`, function(error, titles){
                // 글 목록이 담겨진 titles
                if(error) throw error;
                db.query(`SELECT * FROM topic WHERE id=?`, [filteredId], function(error2, topic){
                    // 사용자가 요청한 글 정보이 담겨진 topic

                    // SELECT * FROM topic WHERE id=${queryData.id}
                    // 위 SQL문처럼 사용될 경우 데이터베이스가 갖고 있는 코드의 특성으로 인하여 공격을 당할 수도 있다.
                    // 그렇기에 보안상의 이유로
                    // SELECT * FROM topic WHERE id=?
                    // 이렇게 사용하여 ?의 값이 무엇인가를 배열에 담아서 db.query()의 두 번째 인자로 주게되면
                    // 배열의 값이 ?에 치환되게 되는데 이 때 공격의 의도가 있는 데이터는 자동으로 세탁된다.

                    if(error2) throw error2;

                    title = topic[0].title;
                    contents = topic[0].description;
                    list = template.makeFileList(titles);

                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(contents);

                    response.writeHead(200);
                    response.end(template.html(list, sanitizedTitle,
                        `<p>${sanitizedDescription}</p>`,
                        `
                        <ul id="controlBtnList">
                            <a href="./create" class="controlBtn">Create</a> <a href="./update?id=${filteredId}" class="controlBtn">Update</a>
                            <form action="/delete_process" method="POST" class="controlBtn">
                                <input type="hidden" name="id" value="${filteredId}">
                                <input type="submit" value="Delete" >
                            </form>
                        </ul>
                        `
                    ));
                });
            });
        }
    }else if(pathName === "/create"){ // 글 생성 UI 페이지를 만드는 부분
        title = "Create Page";
        contents = `
        <form action="/create_process" method="post">
            <input type="text" name="title" placeholder="title"><br>
            <textarea name="description" placeholder="description"></textarea><br>
            <input type="submit">
        </form>
        `; // 입력받은 글 제목과 내용 데이터를 POST방식으로 서버에게 보내고 "/create_process"라는 url을 요청(request)하는 form 태그

        /*
        // file system code
        fs.readdir("./nodejs_data", function(err, fileList){
            list = template.makeFileList(fileList);
            response.writeHead(200);
            response.end(template.html(list, title, `${contents}`, ``));
        })
        */

        // MySQL database code
        db.query(`SELECT * FROM topic`, function(error, titles){
            if(error) throw error;
            list = template.makeFileList(titles);
            response.writeHead(200);
            response.end(template.html(list, title,
                `${contents}`,
                `
                <ul id="controlBtnList">
                    <a href="./create" class="controlBtn">Create</a>
                </ul>
                `
            ));
        });
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
            
            /*
            // file system code
            fs.writeFile(`nodejs_data/${filteredId}`, description, "utf8", function(err){
                response.writeHead(302, {Location : `/?id=${filteredId}`});
                // 서버가 응답을 마치면 Location의 값으로 사용자를 보낸다.
                // 301 : 페이지가 완전히 이전되었습니다
                // 302 : 리다이렉션
                // redirection : 어떠한 처리를 한 후에 사용자를 다른 페이지로 튕겨버리는 것을 리다이렉션이라고 한다.
                response.end();
            });
            */

            // DataBase Code
            db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
            [title, description, 1],
            function(err, data){
                if(err) throw err;
                response.writeHead(302, {Location : `/?id=${data.insertId}`});
                response.end();
            });
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