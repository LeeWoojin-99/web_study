var express = require("express");
var router = express.Router();
module.exports = router;

var db = require("../lib/db");
var template = require("../lib/template");
var sanitizeHtml = require("sanitize-html");

router.get("/create", function(request, response){
    var title = `Create Page`
    var list = template.list(request.topics);
    var contents = `
        <form action="/topic/create/process" method="post">
            <input type="text" name="title" placeholder="title"><br>
            <textarea name="description" placeholder="description"></textarea><br>
            <input type="submit">
        </form>
    `;

    response.send(template.html(list, title,
        `${contents}`,
        `<a href="/topic/create">Create</a>`
    ));
});

router.post("/create/process", function(request, response){
    var post = request.body;

    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
    [post.title, post.description, 1],
    function(err, data){
        if(err) throw err;
        response.redirect(302, `/topic/${data.insertId}`);
        response.send();
    });
});

router.get("/update/:pageId", function(request, response){
    var pageId = request.params.pageId;

    db.query(`SELECT * FROM topic WHERE id=?`,
    [pageId],
    function(error2, topic){
        if(error2) throw error2;

        var title = `${topic[0].title} - Update`
        var list = template.list(request.topics);
        var contents = `
            <form action="/topic/update/process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}"><br>
                <input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"><br>
                <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea><br>
                <input type="submit">
            </form>
        `;
        
        response.send(template.html(list, title,
            `${contents}`,
            `<a href="/topic/create">Create</a>`
        ));
    });
});

router.post("/update/process", function(request, response){
    var post = request.body;

    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
    [post.title, post.description, 1, post.id],
    function(error, data){
        if(error) throw error;
        response.redirect(302, `/topic/${post.id}`);
        response.send();
    });
});

router.post("/delete", function(request, response){
    var post = request.body;

    db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(err, data){
        if(err) throw err;
        response.redirect(302, `/`);
        response.send();
    });
});

router.get("/:pageId", function(request, response, next){
    console.log("page"); // TEST

    var pageId = request.params.pageId;

    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
    [pageId],
    function(error, topic){
        if(error){
            next(error);
        }else{
            var title = topic[0].title;
            var contents = sanitizeHtml(topic[0].description);
            var list = template.list(request.topics);

            response.send(template.html(list, title,
                `
                <p>${contents}</p>
                By ${sanitizeHtml(topic[0].name)}
                `, `
                <a href="/topic/create">Create</a>
                <a href="/topic/update/${pageId}">Update</a>
                <form action="/topic/delete" method="POST">
                    <input type="hidden" name="id" value="${pageId}">
                    <input type="submit" value="Delete" >
                </form>
                `
            ));
        }
    });
});