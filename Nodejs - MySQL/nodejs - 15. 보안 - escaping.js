// nodejs - 16. 보안 - escaping

// 사용자가 입력한 정보는 얼마든지 보안에 위협이 될 수 있다.
// 여기서는 사용자가 입력한 정보가 출력될 때
// 출력되는 데이터를 안전하게 만드는 작업을 할 것이다.

// topic.js
// author.js
// template module
// 위의 세 파일에서
// sanitize-html module을 사용하여 출력 정보를 세탁

// topic.js
// page method -> 글의 내용을 타나내는 부분, 저자의 이름을 나타내는 부분
// update method -> 기존의 글의 제목과 내용을 나타내는 부분

// template module
// html method -> 글의 제목을 나타내는 부분
// makeFileList method -> li>a 태그 안에 글의 제목이 들어가는 부분
// author 관련 method
// authorSelect method -> option 태그 안에 저자의 이름이 들어가는 부분
// authorTable method -> td 태그 안에 저자의 이름, 프로필이 들어가는 부분
// 
// 글의 제목은 template module에서 세탁하는데 글의 내용은 왜 다른 곳에서 세탁하는가 ?
// 내용을 나타내는 부분은 author.js에서 table 태그로 구현된 저자 목록을 html method의 인수값으로 하여 호출하는데
// table 태그에 세탁되어 내용이 나타나지 않기 때문에 template module이 아닌 topic module에서 세탁하였다.

// author.js
// author update method -> 기존의 저자의 이름과 프로필이 나타나는 부분

// queryData.id를 세탁하지 않아도 되는 이유
// db.query()에서 SQL문에서 queryData.id와 테이블의 id값이 같은 것을 불러오는데
// queryData.id가 숫자가 아닌 다른 값이라면 SQL 문법 오류가 발생한다.
// 
// fs module을 사용할 때 queryData.id를 세탁했던 이유
// fs module을 사용할 때는 queryData.id으로 경로를 이동할 수 있는 값을 줘서 보안에 위협이 되어서
// path module을 사용하여 경로에 접근할 수 있는 것이 제외된 값만을 추출하여 사용했다.

var http = require("http");
var url = require("url");
var topic = require("../../../Study Codes/lib/topic.js");
var author = require("../../../Study Codes/lib/author.js");

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