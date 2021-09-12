var db = require("./db");
var template = require("./nodejs - template module (MySQL).js");
var url = require("url");
var qs = require("querystring");
// html의 form 태그에서 서버로 보내는 데이터가 query string 형태의 데이터이기 때문에 받아온 데이터를 js의 객체 형태로 변환해주는 기능을 사용하기 위한 'querystring' 모듈

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, titles){
        // 글 목록을 구성할 때 사용될 정보가 담겨진 titles
        if(error) throw error;

        var title = "Home Page";
        var list = template.makeFileList(titles);
        var contents = "Hello Node.js";

        response.writeHead(200);
        response.end(template.html(list, title,
            `<p>${contents}</p>`,
            `
            <ul id="controlBtnList">
                <a href="./create" class="controlBtn">Create</a>
            </ul>
            `
        ));
    });
}

exports.page = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){
            // 사용자가 요청한 글 정보이 담겨진 topic
            if(error2) throw error2;

            // SELECT * FROM topic WHERE id=${queryData.id}
            // 위 SQL문처럼 사용될 경우 데이터베이스가 갖고 있는 코드의 특성으로 인하여 공격을 당할 수도 있다.
            // 그렇기에 보안상의 이유로
            // SELECT * FROM topic WHERE id=?
            // 이렇게 사용하여 ?의 값이 무엇인가를 배열에 담아서 db.query()의 두 번째 인자로 주게되면
            // 배열의 값이 ?에 치환되게 되는데 이 때 공격의 의도가 있는 데이터는 자동으로 세탁된다.

            var title = topic[0].title;
            var contents = topic[0].description;
            var list = template.makeFileList(titles);

            response.writeHead(200);
            response.end(template.html(list, title,
                `<p>${contents}</p>
                By ${topic[0].name}`,
                `
                <ul id="controlBtnList">
                    <a href="./create" class="controlBtn">Create</a> <a href="./update?id=${queryData.id}" class="controlBtn">Update</a>
                    <form action="/delete_process" method="POST" class="controlBtn">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="Delete" >
                    </form>
                </ul>
                `
            ));
        });
    });
}

exports.create = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, titles){
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            // 저자를 선택하는 것을 구성할 때 사용되는 정보가 담겨진 authors
            if(error2) throw error2;

            var title = `Create Page`
            var list = template.makeFileList(titles);
            var contents = `
                <form action="/create_process" method="post">
                    <input type="text" name="title" placeholder="title"><br>
                    <textarea name="description" placeholder="description"></textarea><br>
                    ${template.authorSelect(authors)}<br>
                    <input type="submit">
                </form>
            `; // 입력받은 글 제목과 내용 데이터를 POST방식으로 서버에게 보내고 "/create_process"라는 url을 요청(request)하는 form 태그

            response.writeHead(200);
            response.end(template.html(list, title,
                `${contents}`,
                `
                <ul id="controlBtnList">
                    <a href="./create" class="controlBtn">Create</a>
                </ul>
                `
            ));
        })
    });
}

exports.create_process = function(request, response){
    var body = "";
    request.on("data", function(data){
        body += data;
    })
    request.on("end", function(){ // data를 모두 받아왔을 때 실행되는 부분
        // console.log(body); // query string의 형태로 데이터를 받아왔다.
        // ex) title=abc&description=a+b+c+d+e

        var post = qs.parse(body); // qs(query string)의 메서드 parse를 이용하여 query string data를 js object data로 변환한다.
        // console.log(post); // web browser에서 web server로 보내서 받아진 query string data가 javascript object data로 변환된 데이터이다.

        db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.author],
        function(err, data){
            if(err) throw err;
            response.writeHead(302, {Location : `/?id=${data.insertId}`});
            // insertId : INSERT가 이루어진 행의 id값
            response.end();
        });
    })
}

exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, function(error, titles){
        // 글 목록을 구성할 때 사용될 정보가 담겨진 titles
        if(error) throw error;
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic){
            // 선택된 글에 대한 정보를 담고있는 데이터 topic
            if(error2) throw error2;
            db.query(`SELECT * FROM author`, function(error3, authors){
                // 저자들에 대한 정보를 담고있는 데이터 authors
                if(error3) throw error3;

                var title = `${topic[0].title} - Update`
                var list = template.makeFileList(titles);
                var contents = `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}"><br>
                        <input type="text" name="title" placeholder="title" value="${topic[0].title}"><br>
                        <textarea name="description" placeholder="description">${topic[0].description}</textarea><br>
                        ${template.authorSelect(authors, topic[0].author_id)}<br>
                        <input type="submit">
                    </form>
                `; // authorSelect 메서드의 두 번째 인수값인 topic[0].author_id는 현재 저자가 누구인지에 관련된 데이터이다.
                
                response.writeHead(200);
                response.end(template.html(list, title,
                    `${contents}`,
                    `
                    <ul id="controlBtnList">
                        <a href="./create" class="controlBtn">Create</a>
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
        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
        [post.title, post.description, post.author, post.id],
        function(error, data){
            if(error) throw error;
            response.writeHead(302, {Location : `/?id=${post.id}`});
            // console.log(data.insertId); // 여기서 data.insertId의 값은 0이다.
            // post.id를 id값으로 가지는 행의 정보를 바꾼 것이기 때문에 Location에서 post.id를 사용하였다.
            response.end();
        });
    })
}

exports.delete = function(request, response){
    var body = "";
    request.on("data", function(data){
        body += data;
    })
    request.on("end", function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(err, data){
            if(err) throw err;
            response.writeHead(302, {Location : `/`});
            response.end();
        })
    })
}