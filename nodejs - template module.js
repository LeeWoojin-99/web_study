module.exports = {
    html:function(list, title, body, control){ // HTML에 대한 template를 제작하여 반환하는 함수 함수
        return `
            <!--  -->
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
                <title>${title}</title>
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                <h2>${title}</h1>
                ${list}
                ${control}
                ${body}
            </body>
            </html>
        `;
    },
    makeFileList:function(fileList){ // 이름들이 담긴 배열을 인수값으로 받아서 ul태그와 각 이름에 알맞는 li태그들을 구성하는 함수
        var list = "<ul id=\"fileList\">\n";
        for(i of fileList){
            list += `${" ".repeat(4).repeat(5)}<li><a href = "/?id=${i}">${i}</a></li>\n`
        }
        list += `${" ".repeat(4).repeat(4)}</ul>\n`;
        return list
    }
}