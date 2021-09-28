var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require("./lib/db");

// module로 만들어진 router들을 불러오기
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');

var app = express();

// view engine setup
// views 폴더와 view engine을 지정하기
app.set('views', path.join(__dirname, 'views')); // views 폴더를 지정
// response.render(path, object, callback function) 메서드를 사용할 때 path에 입력된 파일을 views 폴더로 지정된 폴더에서 탐색한다.
app.set('view engine', 'ejs');
// view engine은 서버의 데이터를 정적인 페이지(HTML)에 편리하게 출력해주기 위해서 사용된다.
// render() 메서드를 사용할 때 path로 지정된 파일이 어떤 파일이냐에 따라서 다른 view engine을 사용해야 적절한 정적인 페이지를 얻을 수 있다.

app.use(logger('dev')); // logger = morgan module
app.use(express.json()); // json data body parser
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded data body parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // static directory 지정

// topic을 읽어오는 부분
app.get("*", function(request, response, next){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) throw error;
        request.topics = topics;
        next("route");
    });
});

// 모듈로 읽어온 router들을 사용
app.get("/", indexRouter);
app.use("/topic", topicRouter);

// catch 404 and forward to error handler
// 404 error 처리 부분
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// 그 외의 에러 처리 부분
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
app.listen(2000);
