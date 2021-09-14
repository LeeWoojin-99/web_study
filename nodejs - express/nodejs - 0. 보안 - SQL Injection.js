// nodejs - 16. 보안 - SQL Injection

// 공격의 의도르 가진 SQL 코드를 주입함으로서 공격 목적을 달성하는 기법을 SQL Injection이라고 한다.
// SQL Injection으로부터 방어를 위한 작업에 대한 설명이 있을 것이다.
// 코드상의 변화는 없다.

// 어떤 SQL 코드가 공격을 할 수 있을까 ?
// SELECT * FROM topic WHERE topic.id=${queryData.id}
// query 메서드의 인수값으로 위의 SQL문이 있을 때
// queryData.id의 값으로
// 1;DROP TABLE topic;
// 이라는 값이 올 경우 두 개의 SQL문(SELECT, DROP)을 수행된다.
// SELECT * FROM topic WHERE topic.id=1;DROP TABLE topic;
// 하지만 실제로 저런 값을 주면 오류가 발생한다. 이유는 다음과 같다.

// 오류가 발생한 이유
// mysql module에서 기본 설정으로 한 번의 query()에 두 개의 SQL문이 수행되지 못하게 설정되어 있었기 때문이다.
// mysql.createConnection({...})
// 위 문장에서 ...에는 host, user, password 등의 정보가 들어가게 되는데
// 여기서 multipleStatements를 true로 설정한다면 한 번의 query()에도 복수의 SQL문이 수행될 수 있게 된다.

// multipleStatements를 ture로 설정한 후
// queryData.id의 값으로
// 1;DROP TABLE topic;
// 이라는 값을 줄 경우 SELECT를 수행한 후 DROP까지 수행한다.

// 이러한 공격으로부터 방어하기 위해서 어떻게 해야할까?
// 1. ?을 배열의 요소로 치환하는 방법
// db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], ...)
// query 메서드의 두 번째 인자로 배열을 준다면
// query 메서드의 첫 번째 인자 SQL문에서 ?가
// query 메서드의 두 번째 인자 배열의 요소로 차례대로 치환된다.
// 배열의 요소가 치환될 때 따옴표(')에 감싸져서 치환되기 때문에 문자열로 인식된다.
// 2. escape 메서드를 이용하기
// db.query(`SELECT * FROM topic WHERE id=${db.escape(queryData.id)}`, ...)
// db.escape 메서드를 이용함으로써 queryData.id는 따옴표로 감싸진 채로 SQL문에 삽입된다.
// 
// 세미콜론(;)이 따옴표(')로 감싸진다면 문자열로 인식되므로 한 query 메서드에서 의도치않게 두 개의 SQL문이 실행되는 것을 막을 수 있다.

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