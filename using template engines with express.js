// using template engines with express

// template engine을 사용하면 application에서 static template files를 사용할 수 있다.
// ejs파일을 web application에서 렌더링하여 사용할 수 있다.
// ejs파일에 css file을 link시킬 수 있다.

var express = require("express");
var app = express();

app.set("view engine", "ejs"); // 렌더링에 사용될 template engine을 "ejs"로 설정
app.set("views", "./"); // template file이 있는 곳을 express가 찾을 수 있게 views 폴더를 지정 (기본값은 "./views")
app.use(express.static("./")); // template file에서 css file에 link시킬 수 있게 하기 위해서

app.use("/", (request, response) => {
    response.render("LWJ_ejs", {title:"titles"});
    // 서버가 클라이언트에게 LWJ_ejs.ejs를 렌더링하여 전송
    // ejs file은 렌더링되어 html code가 된다.
});

app.listen(3000);