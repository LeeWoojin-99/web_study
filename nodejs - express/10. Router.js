// 10. Router

// route들을 파일로 분리하여 사용하기 위해서
// express의 router를 이용하였다.
// express의 route : 지정된 경로에 호출될 미들웨어를 지정하는 것.

// /topic/:pageId
// /topic/create
// 이렇게 "/topic"으로 접근하도록 모든 URL을 수정
// route들을 모아서 router를 사용하기 위함이다.

// main.js
// 
// var topicRouter = require("./router/topic");
// require로 express.Router();로 반환된 객체를 모듈로서 가져온다.
// 
// app.use("/topic", topicRouter);
// 가져온 모듈을 미들웨어로서 사용한다.

// router/topic.js
// 
// var express = require("express");
// var router = express.Router();
// express.Router();로 라우트들을 외부에서 사용될 수 있게 하는 라우터 객체를 반환받는다.
// 
// router.get(...);
// app.get(...);으로 라우트를 만들었던 것처럼 app객체가 아닌 router객체에 라우트를 만들면 된다.
// 
// module.exports = router;
// router를 모듈로 사용될 수 있게 한다.

// router를 사용하면 좋은 점
// route들을 모아서 파일로 보관할 수 있다.
// 
// 모듈과의 차이점
// app.use(compression())처럼 app.use()로 쓰인 것들의 효과를 파일로 분리된 router에서도 받을 수 있다.
// express()로 반환받은 객체인 app으로 함께 다루고 있기 때문에 next()로 route끼리 이어질 수 있다. error처리에서 유용하다.

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