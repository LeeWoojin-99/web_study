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
            <form action="/author_create_process" method="post">
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

}

exports.update_process = function(request, response){
    
}

exports.update_delete = function(request, response){
    
}