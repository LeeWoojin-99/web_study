// 7. middleware 만들기

// 인자값이 request, response, next인 함수를 만들었다면 그것이 바로 미들웨어 이며
// 그 미들웨어를 인수값으로 한 app.use()를 호출하면 인수값으로 쓰인 미들웨어를 사용한다는 것이다.
// 미들웨어를 사용하면 클라이언트가 서버에게 요청할 때마다 서버는 미들웨어를 호출한다.

// 미들웨어 내부에서 next()를 호출하면 다음 미들웨어로 넘어간다는 의미이다.
// next라는 변수에는 현재 실행되고 있는 미들웨어의 다음 차례에 호출되어야 하는 미들웨어 함수가 담겨져있다.

// app.get(path, middleware function);
// app.get()에서 쓰이던 두 번째 인자값으로 오던 function이 callback function이 아닌 middleware function이었다.

// 즉 app.use(), app.get(), app.post()로 여러 개의 미들웨어가 존재하고
// 클라이언트의 요청에 해당되는 middleware가 등록된 순서대로 실행된다.

// 각각의 프로그램(middleware function)이 서로와 서로를 이어주는 작은 프로그램이라는 점에서 middleware라는 표현을 한 것일 수도 있다.

var express = require('express');
var app = express();
var compression = require("compression");

var db = require("./lib/db");
var template = require("./lib/template");
var sanitizeHtml = require("sanitize-html");

app.use(express.urlencoded({ extended: false }));
app.use(compression());

// app.use(compression()); 의 compression()같이 미들웨어를 반환하는 함수 만들기
// function middleware(){
//     return function(request, response, next){
//         console.log("hello middleware");
//         next();
//     };
// }
// app.use(middleware());

app.get("*", function(request, response, next){
    // function(request, response, next){...}이라는 미들웨어 함수를 사용
    // 미들웨어를 사용하면 클라이언트가 서버에게 요청할 때마다 서버는 미들웨어를 호출한다.
    // get 방식으로 들어오는(app.get()) 모든 경로의 요청("*")
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) throw error;
        request.topics = topics; // request의 topics속성에 대입
        console.log(request.topics[0].title);
        next(); // 다음 미들웨어 함수를 호출
    });
});

app.get("/", function(request, response){
    var title = "Home Page";
    var list = template.list(request.topics);
    var contents = "Hello Node.js";

    response.send(template.html(list, title,
        `<p>${contents}</p>`,
        `<a href="./create">Create</a>`
    ));
});

app.get("/page/:pageId", function(request, response){
    var pageId = request.params.pageId;

    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
    [pageId],
    function(error2, topic){
        if(error2) throw error2;

        var title = topic[0].title;
        var contents = sanitizeHtml(topic[0].description);
        var list = template.list(request.topics);

        response.send(template.html(list, title,
            `
            <p>${contents}</p>
            By ${sanitizeHtml(topic[0].name)}
            `, `
            <a href="/create">Create</a>
            <a href="/update/${pageId}">Update</a>
            <form action="/delete" method="POST">
                <input type="hidden" name="id" value="${pageId}">
                <input type="submit" value="Delete" >
            </form>
            `
        ));
    });
});

app.get("/create", function(request, response){
    var title = `Create Page`
    var list = template.list(request.topics);
    var contents = `
        <form action="/create/process" method="post">
            <input type="text" name="title" placeholder="title"><br>
            <textarea name="description" placeholder="description"></textarea><br>
            <input type="submit">
        </form>
    `;

    response.send(template.html(list, title,
        `${contents}`,
        `<a href="/create">Create</a>`
    ));
});

app.post("/create/process", function(request, response){
    var post = request.body;

    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
    [post.title, post.description, 1],
    function(err, data){
        if(err) throw err;
        response.redirect(302, `/?id=${data.insertId}`);
        response.send();
    });
});

app.get("/update/:pageId", function(request, response){
    var pageId = request.params.pageId;

    db.query(`SELECT * FROM topic WHERE id=?`,
    [pageId],
    function(error2, topic){
        if(error2) throw error2;

        var title = `${topic[0].title} - Update`
        var list = template.list(request.topics);
        var contents = `
            <form action="/update/process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}"><br>
                <input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"><br>
                <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea><br>
                <input type="submit">
            </form>
        `;
        
        response.send(template.html(list, title,
            `${contents}`,
            `<a href="/create">Create</a>`
        ));
    });
});

app.post("/update/process", function(request, response){
    var post = request.body;

    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
    [post.title, post.description, 1, post.id],
    function(error, data){
        if(error) throw error;
        response.redirect(302, `/page/${post.id}`);
        response.send();
    });
});

app.post("/delete", function(request, response){
    var post = request.body;

    db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(err, data){
        if(err) throw err;
        response.redirect(302, `/`);
        response.send();
    });
});

app.listen(3000);