// 8. serving static files

// express의 기본 제공 미들웨어 함수인 express.static()을 사용하면
// image, css, js file과 같은 정적 파일에 접근이 가능하게 할 수 있다.

// app.use([path], express.static("static directory"));
// 위 문장을 사용함으로서 static directory의 내부에 있는 정적 폴더 및 파일에 접근할 수 있게 된다.
// express.static()의 root directory는 현재 위치한 js파일의 폴더이다.

var express = require('express');
var app = express();
var compression = require("compression");

var db = require("./lib/db");
var template = require("./lib/template");
var sanitizeHtml = require("sanitize-html");

app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use(express.static("public"));
// 현재 위치한 있는 js파일과 동일한 위치(폴더)로부터 'public'이라는 폴더(static directory)에 있는 정적 파일(static file)을 제공할 수 있게 한다.
// URL로도 제공받을 수 있다.
// 'http://localhost:3000/images/hello.jpg'로 접근하여 정적 이미지 파일을 제공받았다.

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
        `
        <p>${contents}</p>
        <img src="/images/hello.jpg" style="display:block; width:200px;">
        `, `<a href="./create">Create</a>`
    ));
    // express.static middleware function을 사용했기 때문에 img태그의 src속성을 "/images/hello.jpg"로 하여
    // "./public/images/hello.jpg"라는 정적인 이미지 파일에 접근할 수 있는 것이다.
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