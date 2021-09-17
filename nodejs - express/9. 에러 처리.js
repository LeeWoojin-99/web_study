// 9. 에러 처리

// 404 error 처리
// 사용자가 요청한 페이지가 존재하지 않을 때 404 error를 처리한다.
// 다른 route들보다 후에 위치시켜서 찾는 route가 없을 때 접근되도록 한다.

// 발생한 error에 대한 처리
// 404 error는 찾는 페이지가 없을 때 접근하도록 했던 에러지만
// route에 접근하여 처리되고 있던 도중에 에러가 발생했다면
// 발생한 error를 처리하는 middleware function을 호출하여 에러를 처리해야 한다.
// 
// 발생한 error를 인수값으로 하여 next()를 호출하는 것을 통하여
// error를 다루는 middleware function을 호출할 수 있다.
// error를 다루는 middleware function의 인자값은 error, request, response, next 네 개이다.
// 즉 에러가 발생한 route에서 next(error);를 호출한다면
// 인자값이 error, request, response, next 네 개인 middleware function을 호출한다.
// 
// error가 발생하지 않았는데 next(error);를 호출한다면 error를 다루는 middleware funciton이 호출되지 않는다.
// next를 호출하므로 error가 발생하는 route의 middleware function의 인자값에 next가 있어야 한다.

var express = require('express');
var app = express();
var compression = require("compression");

var db = require("./lib/db");
var template = require("./lib/template");
var sanitizeHtml = require("sanitize-html");

app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static("public"));

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
});

app.get("/page/:pageId", function(request, response, next){
    var pageId = request.params.pageId;

    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
    [pageId],
    function(error, topic){
        if(error){
            next(error);
            // error를 인수값으로 next()를 호출한다면
            // 인자값이 error, request, response, next 네 개인 middleware function가 호출된다.
        }else{
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
        }
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

app.use(function(request, response, next){
    // 다른 route보다 아래에 두어서 사용자가 요청한 route가 없다면 접근되도록 한다.
    response.status(404).send("Not Found");
})

app.use(function(error, request, response, next){
    // 404 error를 다루는 middleware function보다 후에 위치해야 한다.
    // 첫 번째 인자값 err는 next(err);를 통하여 입력된 값이다.
    console.error(error.stack);
    response.status(500).send("Something broke!");
})

app.listen(3000);