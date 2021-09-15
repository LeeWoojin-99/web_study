// 2. 홈페이지 구현

// 기존의 홈페이지를 express framework를 이용하여 구현하였다.

var express = require('express');
var app = express();

var db = require("../../../Study Codes/lib/db");
var template = require("../../../Study Codes/lib/template");

app.get("/", function(request, response){
    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;

        var title = "Home Page";
        var list = template.makeFileList(titles);
        var contents = "Hello Node.js";

        response.send(template.html(list, title,
            `<p>${contents}</p>`,
            `<a href="./create">Create</a>`
        ));
    });
});

app.listen(3000);