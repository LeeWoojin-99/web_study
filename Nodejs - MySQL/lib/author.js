var db = require("./db");
var template = require("./nodejs - template module (MySQL).js");
var url = require("url");
var qs = require("querystring");

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) throw error2;

            var title = "Author Page";
            var list = template.makeFileList(titles);
            var contents = template.authorTable(authors);
    
            response.writeHead(200);
            response.end(template.html(list, title,
                `
                ${contents}
                <style>
                    table{
                        font-size: 30px;
                        border-collapse: collapse;
                        background: white;
                    }
                    td{
                        border: 1px solid black;
                        padding: 10px;
                    }
                </style>
                `,
                `
                <ul id="controlBtnList">
                    <a href="./author_create" class="controlBtn">Create</a>
                </ul>
                `
            ));
        });
    });
}

exports.create = function(request, response){ // 저자 생성 페이지 생성
    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) throw error2;

            var title = "Author Craete Page";
            var list = template.makeFileList(titles);
            var contents = `
            <form action="/author/create_process" method="post">
                <input type="text" name="name" placeholder="name"><br>
                <textarea name="profile" placeholder="profile"></textarea><br>
                <input type="submit">
            </form>
            `;
    
            response.writeHead(200);
            response.end(template.html(list, title,
                `
                ${contents}
                `, ``
            ));
        });
    });
}

exports.create_process = function(request, response){ // 저자 생성 처리
    var body = "";
    request.on("data", function(data){
        body += data;
    })
    request.on("end", function(){
        var post = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
        [post.name, post.profile],
        function(err, data){
            if(err) throw err;
            response.writeHead(302, {Location : `/author`});
            response.end();
        });
    })
}

exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;
        db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error2, author){
            if(error2) throw error2;
            db.query(`SELECT * FROM author`, function(error3, authors){
                if(error3) throw error3;

                var title = `${author[0].name} - Update`
                var list = template.makeFileList(titles);
                var contents = template.authorTable(authors);
                
                response.writeHead(200);
                response.end(template.html(list, title,
                    `
                    ${contents}
                    <style>
                        table{
                            font-size: 30px;
                            border-collapse: collapse;
                            background: white;
                        }
                        td{
                            border: 1px solid black;
                            padding: 10px;
                        }
                    </style>
                    <form action="/author/update_process" method="post">
                        <input type="hidden" name="id" value="${author[0].id}"><br>
                        <input type="text" name="name" placeholder="name" value="${author[0].name}"><br>
                        <textarea name="profile" placeholder="profile">${author[0].profile}</textarea><br>
                        <input type="submit">
                    </form>
                    `, // form태그에서 변수 id, name, profile을 query string 형태의 데이터로 서버에게 전송
                    `
                    <ul id="controlBtnList">
                        <a href="/create" class="controlBtn">Create</a>
                    </ul>
                    `
                ));
            })
        })
    })
}

exports.update_process = function(request, response){
    var body = "";
    request.on("data", function(data){
        body += data;
    })
    request.on("end", function(){
        var post = qs.parse(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
        [post.name, post.profile, post.id],
        function(error, data){
            if(error) throw error;
            response.writeHead(302, {Location : `/author`});
            response.end();
        });
    })
}

exports.update_delete = function(request, response){
    
}