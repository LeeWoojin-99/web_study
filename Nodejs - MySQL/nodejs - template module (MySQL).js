module.exports = {
    html:function(list, title, body, control){ // HTML에 대한 template를 제작하여 반환하는 함수 함수
        return `
            <!--  -->
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
                <title>${title}</title>
                <style>
                    /* nodejs application CSS */

                    *{
                        padding: 0;
                        margin: 0;
                    }
                    html{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: rgb(255, 249, 172);

                        font-family: serif;
                    }
                    body{
                        width:600px;
                    }
                    a{
                        text-decoration: none;
                        color: black;
                    }
                    li{
                        list-style: none;
                    }
                    h1{
                        text-align: center;
                    }
                    h1 a{
                        text-decoration: none;
                        font-size: 150px;
                    }
                    h2{
                        text-align: center;
                        font-size: 50px;
                    }
                    ul{
                        margin-bottom: 50px;
                    }
                    ul#fileList li a{
                        display: inline-block;
                        font-size: 24px;
                        padding: 3px 12px;
                        margin: 5px 0;
                        background: rgb(73, 15, 15);
                        border-radius: 10px;
                        color: #fff;
                        transition: 1s;
                        font-family: sans-serif;
                    }
                    ul#fileList li a:hover{
                        background: rgb(146, 44, 44);
                    }
                    /* create, update, delete */
                    ul#controlBtnList{
                        display: flex;
                    }
                    .controlBtn{
                        display: block;
                        position: relative;
                        padding: 10px;
                        margin: 0 20px;

                        text-decoration: none;
                        font-size: 18px;
                        font-family: sans-serif;
                        color: #000;

                        transition: 0.5s;
                    }
                    ul:hover .controlBtn{
                        /* 메뉴에 마우스를 올리면 크기가 커지며 불투명해지고 흐려진다. */
                        transform: scale(1.5);
                        opacity: 0.2;
                        filter: blur(2px);
                    }
                    ul:hover .controlBtn:hover{
                        /* 메뉴 중에서 마우스가 올라간 항목의 크기가 커지며 선명해진다. */
                        transform: scale(2);
                        opacity: 1;
                        filter: blur(0);
                    }
                    .controlBtn:before{
                        /* 마우스가 올라간 항목의 배경에 효과를 주기 위해서 배경을 before로 따로 제작 */
                        content: "";
                        position: absolute;
                        top: 0; left: 0;
                        width: 100%; height: 100%;
                        background: #67c92f;

                        transition: 0.5s;
                        transform-origin: right;
                        /* 효과가 시작되는 위치를 오른쪽으로 설정 */
                        transform: scaleX(0);
                        /* 안보이다가 마우스를 올리면 보이게 할 예정 */
                        
                        z-index: -1;
                        /* 배경을 before을 통하여 따로 제작한 것이기 때문에 a 태그의 뒤로 가도록 z-index를 -1로 설정 */
                    }
                    .controlBtn:hover:before{
                        /* 마우스가 올라가면 크기가 정상으로 */
                        transform: scaleX(1);
                    }
                    form.controlBtn{
                        padding: 0;
                    }
                    .controlBtn input[value="Delete"]{
                        background-color: transparent;
                        border: none;
                        font-size: 18px;
                        font-family: sans-serif;
                        color: #000;
                        cursor: pointer;
                        padding: 10px;
                    }
                    p{
                        width: 600px;
                        margin-top: 50px;
                        padding: 10px;
                        background: white;
                        border-radius: 10px;
                        border: 1px solid black;
                        font-size: 24px;
                        font-family: sans-serif;
                    }
                </style>
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
        for(i in fileList){
            list += `${" ".repeat(4).repeat(5)}<li><a href = "/?id=${i}">${fileList[i].title}</a></li>\n`
        }
        list += `${" ".repeat(4).repeat(4)}</ul>\n`;
        return list
    }
}