// 5. middleware - body parser

// body parser middleware를 이용하여 서버가 전송받은 데이터를 parsing하는 것을 간결화 하였다.

// 클라이언트에서 서버에게 전송한 데이터는 서버에서 파싱(parsing)하여 javascript 데이터로 가공해야 원활히 사용될 수 있다.
// parsing 작업을 도와주는 express framework의 body parser middleware가 있다.

// express.json(), express.urlencoded()
// express framework의 built-in middleware function이다.
// 
// 클라이언트로부터 전송받은 데이터의 content-type에 따라서 다른 함수를 실행해야 한다.
// content-type : 클라이언트가 서버에게 어떤 유형의 데이터가 전송됐는지를 알려주는 값
// 
// 함수를 실행하면 post 방식으로 전송받은 데이터가 javascript 객체의 형태로 request.body에 자동으로 담겨진다.
// request.body는 기본적으로 undefined값을 가지며 express.json() 또는 express.urlencoded()와 같은 body-parsing 미들웨어를 사용할 때 채워진다.
// 
// 사용 방법
// app.use(express.json());
// 위 문장처럼 app.use()의 인수값에 넣어서 사용된다.

// express.json()
// JSON : JavaScript Object Notaion
// 클라이언트로부터 전송받은 JSON 데이터가 js의 객체로 변환하여 request.body에 담겨진다.

// express.urlencoded()
// 클라이언트로부터 전송받은 'application/x-www-form-urlencoded'라는 content-type의 데이터가 변환(parse)되어 request.body에 담겨진다.
// 클라이언트에서 html form 태그를 사용하여 post 방식으로 요청하면 그 데이터의 content-type은 'application/x-www-form-urlencoded'이다.
// application/x-www-form-urlencoded : &으로 분리되고, "=" 기호로 값과 키를 연결하는 key-value 형태의 데이터

var express = require('express');
var app = express();

var db = require("./lib/db");
var template = require("./lib/template");
var sanitizeHtml = require("sanitize-html");

// var qs = require("querystring");
app.use(express.urlencoded({ extended: false }));
// false 값일 시 node.js에 querystring, true 값일 시 qs 라이브러리를 사용한다.
// qs와 querystring library의 차이점 : https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0/45690436#45690436

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
                `<p>${contents}</p>`,
                `
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

        var title = `Create Page`
        var list = template.list(titles);
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
});

app.post("/create/process", function(request, response){
    var post = request.body;

    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
    [post.title, post.description, 1],
    function(err, data){
        if(err) throw err;
        response.redirect(302, `/?id=${data.insertId}`);
        // redirect([HTTP status code], path)
        response.send();
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

            var title = `${topic[0].title} - Update`
            var list = template.list(titles);
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