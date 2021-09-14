// 0. express를 쓰기 전의 모습

// framwork express를 사용하기 전의 웹 애플리케이션의 모습이다.
// node.js와 MySQL로 구현한 웹 애플리케이션이다.

// node.js - MySQL 폴더의 'nodejs - 16. 보안 - SQL Injection'과 같다.

var http = require("http");
var url = require("url");
var topic = require("./Study Codes/lib/topic.js");
var author = require("./Study Codes/lib/author.js");

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    if(pathName === "/"){
        if(queryData.id === undefined){ // 홈 페이지 생성
            topic.home(request, response);
        }else{ // 상세 페이지 생성
            topic.page(request, response);
        }
    }else if(pathName === "/create"){ // 글 생성 UI 페이지 생성
        topic.create(request, response);
    }else if(pathName === "/create_process"){ // 글 생성 처리
        topic.create_process(request, response);
    }else if(pathName === "/update"){ // 글 수정 UI 페이지 생성
        topic.update(request, response);
    }else if(pathName === "/update_process"){ // 글 수정 처리
        topic.update_process(request, response);
    }else if(pathName === "/delete_process"){ // 글 삭제 처리
        topic.delete_process(request, response);
    }
    // author
    else if(pathName === "/author"){ // 저자 목록 페이지 생성
        author.home(request, response);
    }else if(pathName === "/author/create"){ // 저자 생성 페이지 생성
        author.create(request, response);
    }else if(pathName === "/author/create_process"){ // 저자 생성 페이지 생성
        author.create_process(request, response);
    }else if(pathName === "/author/update"){ // 저자 생성 페이지 생성
        author.update(request, response);
    }else if(pathName === "/author/update_process"){ // 저자 생성 페이지 생성
        author.update_process(request, response);
    }else if(pathName === "/author/delete_process"){ // 저자 생성 페이지 생성
        author.delete_process(request, response);
    }else{ // not found page
        response.writeHead(200);
        response.end("not found");
    }
});
app.listen(3000);