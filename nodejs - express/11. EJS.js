// 11. EJS

// EJS : Embedded JavaScript

// 'template.js'의 html method에서 개발자가 template literal로 입력하여 생성하던 html code를
// 'htmlTemplate.ejs'로 만들어서 'template.js'에서 ejs file을 렌더링하여 html code를 만들어낸다.

// ejs file을 rendering하는 방법을 이용하면 좋은 점
// html 문법 자동완성 기능을 사용할 수 있다.
// template 기능을 file로 분리함으로써 관리가 용이하다.

var express = require('express');
var app = express();
var compression = require("compression");
var db = require("./lib/db");

var topicRouter = require("./router/topic");
var homeRouter = require("./router/index");
var errorRouter = require("./router/error");

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

app.get("/", homeRouter);
app.use("/topic", topicRouter);
app.use(errorRouter);

app.listen(3000);