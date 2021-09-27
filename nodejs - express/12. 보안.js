// 12. 보안

// Express를 최신 버전으로 유지하라
// Use HTTPS : HTTP가 아닌 HTTPS를 사용하라
// Use Helmet : 헬멧 모듈을 사용하라
// Use cookies securely : 쿠키를 올바르고 안전하게 사용하라
// ensure your dependencies are secure : nsp module을 이용하여 다른 모듈들의 보안성 검사를 할 수 있다.

var express = require('express');
var app = express();
var compression = require("compression");
var db = require("./lib/db");

var helmet = require("helmet");
app.use(helmet());
// 보안 이슈들을 자동으로 해결해주는 모듈 helmet

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