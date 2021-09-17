// 7. middleware 실행 순서

// 코드상의 변경점은 없다.

// 우리가 사용한 미들웨어는 application-level의 middleware이다.
// 미들웨어의 타입은 third-party middleware, application-level middleware, 등이 있다.

// app.use([path], middleware function(request, response, [next]){...});
// middleware function의 next 메서드의 실행 여부에 따라서 그 다음 미들웨어를 실행할 지 안할 지 결정한다.
// app.use()가 아닌 app.get(), app.post()를 통하여 데이터를 전송받은 방식이 get인가 post인가에 따라서 다른 미들웨어가 호출되게 할 수 있다.

// app.use(middleware function 1(req, res, next){... next();}, middleware function 2(req, res, next){... next();})
// middleware function을 콤마(,)로 이어붙이는 것으로 연속하여 호출할 수 있다. 
// 단 middleware function 1에 next();가 존재해야 연속하여 middleware function 2가 호출된다.

// next method의 인수값으로 "route"를 주고 호출하면 다음 라우트를 실행시킨다. 라는 의미이다.
// 여기서 라우트는 경로가 지정된 app.use, app.get, app.post 메서드이다.
// 같은 라우트 내에 다음 middleware function이 존재해도 next("route");가 실행되면 다른 라우트의 middleware function을 호출한다.

var express = require('express');
var app = express();
var compression = require("compression");

var db = require("./lib/db");
var template = require("./lib/template");
var sanitizeHtml = require("sanitize-html");

app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.get("*", function(request, response, next){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) throw error;
        request.topics = topics;
        next("route");
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