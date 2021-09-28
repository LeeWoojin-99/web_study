var express = require("express");
var router = express.Router();
module.exports = router;

var template = require("../lib/template");

router.use(function(request, response){
    var title = "Home Page";
    var list = template.list(request.topics);
    var contents = "Hello Node.js";

    response.send(template.html(list, title,
        `
        <p>${contents}</p>
        <img src="/images/hello.jpg" style="display:block; width:200px;">
        `, `<a href="/topic/create">Create</a>`
    ));
});