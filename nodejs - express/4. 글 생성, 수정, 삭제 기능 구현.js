// 4. 글 생성, 수정, 삭제 기능 구현

// 생성, 수정, 삭제 기능을 구현하였다.
// CRUD 중에서 Create, Update, Delete

// post 방식으로 요청받았은 것을 다룰 때는
// app.get 메서드가 아닌 app.post 메서드를 사용한다.

// request.redirect(HTTP status code, path);
// response.send 메서드 후에 페이지의 리다이렉션을 설정한다.

var express = require('express');
var app = express();

var db = require("../../../Study Codes/lib/db");
var template = require("../../../Study Codes/lib/template");
var sanitizeHtml = require("sanitize-html");
var qs = require("querystring");

app.get("/", function(request, response){
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
    var pageId = request.params.pageId;

    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;

        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
        [pageId],
        function(error2, topic){
            if(error2) throw error2;

            var title = topic[0].title;
            var contents = sanitizeHtml(topic[0].description);
            var list = template.list(titles);

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
});

app.get("/create", function(request, response){
    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) throw error2;

            var title = `Create Page`
            var list = template.list(titles);
            var contents = `
                <form action="/create/process" method="post">
                    <input type="text" name="title" placeholder="title"><br>
                    <textarea name="description" placeholder="description"></textarea><br>
                    ${template.authorSelect(authors)}<br>
                    <input type="submit">
                </form>
            `;

            response.send(template.html(list, title,
                `${contents}`,
                `<a href="/create">Create</a>`
            ));
        });
    });
});

app.post("/create/process", function(request, response){
    // "/create"에서 form태그의 데이터들을 post 방식으로 서버에게 요청했다.
    // post 방식으로 브라우저에서 요청했기 때문에 get 메서드가 아닌 post 메서드를 사용
    // 데이터를 URL에 포함하여 전송하는 get 방식
    // 데이터를 바디에 포함하여 전송하는 post 방식

    var body = "";
    request.on("data", function(data){
        body += data;
    })
    request.on("end", function(){
        var post = qs.parse(body);

        db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.author],
        function(err, data){
            if(err) throw err;
            response.redirect(302, `/?id=${data.insertId}`);
            // redirect([HTTP status code], path)
            response.end();
        });
    });
});

app.get("/update/:pageId", function(request, response){
    var pageId = request.params.pageId;

    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;
        db.query(`SELECT * FROM topic WHERE id=?`,
        [pageId],
        function(error2, topic){
            if(error2) throw error2;
            db.query(`SELECT * FROM author`, function(error3, authors){
                if(error3) throw error3;

                console.log(request.params);
                console.log(topic);
                var title = `${topic[0].title} - Update`
                var list = template.list(titles);
                var contents = `
                    <form action="/update/process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}"><br>
                        <input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"><br>
                        <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea><br>
                        ${template.authorSelect(authors, topic[0].author_id)}<br>
                        <input type="submit">
                    </form>
                `;
                
                response.send(template.html(list, title,
                    `${contents}`,
                    `<a href="/create">Create</a>`
                ));
            });
        });
    });
});

app.post("/update/process", function(request, response){
    var body = "";
    request.on("data", function(data){
        body += data;
    })
    request.on("end", function(){
        var post = qs.parse(body);

        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
        [post.title, post.description, post.author, post.id],
        function(error, data){
            if(error) throw error;
            response.redirect(302, `/page/${post.id}`);
            response.send();
        });
    });
});

app.post("/delete", function(request, response){
    var body = "";
    request.on("data", function(data){
        body += data;
    })
    request.on("end", function(){
        var post = qs.parse(body);

        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(err, data){
            if(err) throw err;
            response.redirect(302, `/`);
            response.send();
        });
    });
});

app.listen(3000);