// 웹서버에서 query string에 따라서 다른 html문서 만들기

var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;

    if(_url === "/"){
        title = "Welcome";
    }
    if(_url === "/favicon.ico"){
        return response.writeHead(404);
    }

    response.writeHead(200);
    // response.end(fs.readFileSync(__dirname + _url));
    // fs.readFileSync(x) : x라는 파일을 읽어온다.

    fs.readFile(`nodejs - ${queryData.id} Lorem.txt`, "utf8", function(err, description){
        var template = `
        <!--  -->
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
            <title>nodejs로 파일 읽기 - ${title}</title>
        </head>
        <body>
            <h1>${title}</h1>
            <ul>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <p>${description}</p>
        </body>
        </html>
        `
        response.end(template);
    })
})
app.listen(3000);