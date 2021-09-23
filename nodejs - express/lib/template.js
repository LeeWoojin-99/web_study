var sanitizeHtml = require("sanitize-html");
var fs = require("fs");
var ejs = require("ejs");

module.exports = {
    html:function(list, title, body, control){
    // HTML에 대한 template를 제작하여 반환하는 함수 함수
        var ejsCode = fs.readFileSync("./lib/htmlTemplate.ejs", "utf-8");
        var htmlCode = ejs.render(ejsCode, {title:sanitizeHtml(title), list:list, body:body, control:control});
        return htmlCode;
    },
    list:function(fileList){
    // 이름들이 담긴 배열을 인수값으로 받아서 ul태그와 각 이름에 알맞는 li태그들을 구성하는 함수
        var list = `<ul id="fileList">\n`;
        for(i in fileList){
            list += `<li><a href = "/topic/${fileList[i].id}">${sanitizeHtml(fileList[i].title)}</a></li>\n`
        }
        list += `</ul>\n`;
        return list;
    }
}