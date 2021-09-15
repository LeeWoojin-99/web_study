var sanitizeHtml = require("sanitize-html");

module.exports = {
    html:function(list, title, body, control){
    // HTML에 대한 template를 제작하여 반환하는 함수 함수
        return `
            <!--  -->
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                <h2>${sanitizeHtml(title)}</h1>
                <a href="/author" id="author">author</a>
                ${list}
                ${control}
                ${body}
            </body>
            </html>
        `;
    },
    list:function(fileList){
    // 이름들이 담긴 배열을 인수값으로 받아서 ul태그와 각 이름에 알맞는 li태그들을 구성하는 함수
        var list = "<ul id=\"fileList\">\n";
        for(i in fileList){
            list += `<li><a href = "/page/${fileList[i].id}">${sanitizeHtml(fileList[i].title)}</a></li>\n`
        }
        list += `</ul>\n`;
        return list
    },
    authorSelect:function(authors, author_id){
    // 저자를 선택하는 select태그, option태그를 구성하는 함수
        var optionTag = ``;
        var selected;
        for(i in authors){
            selected = "";
            if (author_id === authors[i].id) selected = " selected";
            optionTag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>\n`;
        }
        return `
        <select name="author">
        ${optionTag}
        </select>
        `
    },
    authorTable:function(authors){
        var tag = "";
        for (i in authors){
            tag += `
                <tr>
                    <td>${sanitizeHtml(authors[i].name)}</td>
                    <td>${sanitizeHtml(authors[i].profile)}</td>
                    <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                    <td>
                        <form action="/author/delete_process" method="POST">
                            <input type="hidden" name="id" value="${authors[i].id}">
                            <input type="submit" value="Delete" >
                        </form>
                    </td>
                </tr>
            `;
        }
        return `
        <table>
        ${tag}
        </table>
        `
    }
}