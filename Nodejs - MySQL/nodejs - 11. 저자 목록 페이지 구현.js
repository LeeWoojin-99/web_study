// nodejs - 11. 저자 목록 페이지 구현

// 저자 anme, 저자 profile, 수정, 삭제
// 열이 위의 네 항목으로 구성되는 표를 만들어 저자 목록 페이지를 구현하였다.

// pathName === "/author"
// author.js파일을 생성하여 코드를 모듈화

// author module
// author.home(request, response)
// SQL문
// SELECT * FROM author
// 저자들에 대한 정보를 인수값으로 template module의 authorTable 메서드를 호출하여 table 태그를 생성

// template module
// 인자값 authors를 for문으로 반복하여 table 태그의 tr 태그를 생성
// 한 for문에서 생성되는 tr 태그
// <tr>
//     <td>${authors[i].name}</td>
//     <td>${authors[i].profile}</td>
//     <td><a href="/author/update?id=${authors[i].id}">update</a></td>
//     <td><a href="/author/delete_process?id=${authors[i].id}">delete</a></td>
// </tr>

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