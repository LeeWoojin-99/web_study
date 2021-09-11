// nodejs - 10. module로 정리

// 코드를 모듈화하여 정리하였다.
// 모듈화된 코드는 "./lib"에 보관하였다.

var http = require("http");
var url = require("url");
var topic = require("./lib/topic.js");

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
    }else{ // not found page
        response.writeHead(200);
        response.end("not found");
    }
});
app.listen(3000);