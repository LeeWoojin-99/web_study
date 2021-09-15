// 3. 상세 페이지 구현

// template module > makeFileList method
// query string을 route parameter(= URL segment)로 변경

// /page/:pageId
// request.params를 이용하여 route parameter를 읽어와서
// pageId 속성의 값에 해당하는 글의 데이터를 읽어온다.

var express = require('express');
var app = express();

var db = require("../../../Study Codes/lib/db");
var template = require("../../../Study Codes/lib/template");
var sanitizeHtml = require("sanitize-html");

app.get("/", function(request, response){
    // 홈 페이지

    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;

        var title = "Home Page";
        var list = template.list(titles);
        var contents = "Hello Node.js";

        response.send(template.html(list, title,
            `<p>${contents}</p>`,
            `<a href="./create">Create</a>`
        ));
    });
});

app.get("/page/:pageId", function(request, response){
    // 상세 페이지
    
    // "/page/:pageId"
    // "/:pageId"를 route parameter라고 한다. URL segment라고도 한다.
    // URL의 위치에서 지정된 값을 캡쳐하는 데 사용된다.
    // 콜론이 붙은 데이터는 request.params 객체의 속성 형태로 저장된다.
    // console.log(request.params); // {"pageId": "..."}

    var pageId = request.params.pageId;

    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
        [pageId],
        function(error2, topic){
            if(error2) throw error2;

            var title = topic[0].title;
            var contents = sanitizeHtml(topic[0].description);
            var list = template.makeFileList(titles);

            response.send(template.html(list, title,
                `
                <p>${contents}</p>
                By ${sanitizeHtml(topic[0].name)}
                `, `
                <a href="./create">Create</a>
                <a href="./update/${pageId}">Update</a>
                <form action="/delete_process" method="POST">
                    <input type="hidden" name="id" value="${pageId}">
                    <input type="submit" value="Delete" >
                </form>
                `
            ));
        });
    });
});

app.listen(3000);