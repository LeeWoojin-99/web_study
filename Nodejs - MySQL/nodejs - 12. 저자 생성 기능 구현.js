// nodejs - 12. 저자 생성 기능 구현

// pathName === "/author_create"
// 저자 목록 페이지의 create 버튼의 목적지 url을 "/craete"에서 "/author_create"로 변경
// 서버에게 변수 name, profile로 문자열 데이터를 담아서 전송하기 위한 form 태그 구현

// pathName === "/author/create_process"
// SQL문
// INSERT INTO author (name, profile) VALUES(post.name, post.profile)

var http = require("http");
var url = require("url");
var topic = require("./lib/topic.js");
var author = require("./lib/author.js");

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
        topic.delete(request, response);
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