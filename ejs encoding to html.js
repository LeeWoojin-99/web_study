// ejs encoding to html

// 웹 서버에서 웹 브라우저에게 보낼 html code에 변수를 사용하기 위해서는
// html code를 반환하는 함수를 만들어서 html code에서 사용될 변수가 대입될 인자를 정의해주는 방법을 사용하였다.

// 그런데 이런 방법을 사용하면 함수가 반환하게 될 html code를 문자열로 개발자가 입력해야 하기 때문에
// 자동 완성 기능을 사용할 수 없어서 번거롭다.

// 그래서 html code를 반환하는 함수에서 개발자가 문자열로 입력했던 html code를 html 파일에서 작성하고
// javascript의 fs module로 작성했던 html 파일을 불러내는 방법을 사용했더니 문제가 발생했다.

// js파일의 함수에서 문자열에 변수를 사용할 때에는 template literal을 사용하였는데
// html파일에서 template literal을 사용하니 인식을 못하여 오류가 발생하는 것이다.

// ejs 확장자 파일은 html code, js code를 모두 사용할 수 있다.
// 이 때 html code는 기존의 html 문법 그대로 작성되지만 js code는 ejs만의 문법으로 작성된다.
// ejs 파일을 js에서 html code로 인코딩하려면 아래와 같은 방법으로 해야한다.
// js에서 ejs module의 render() 메소드를 사용하면
// ejs 파일에서 html code는 그대로 사용되고 ejs만의 문법으로 작성된 js code는 js로서 실행된다.
// 실행되고 만들어진 문자열이 반환된다.
// 즉 ejs code를 ejs module의 render() 메소드를 사용하여 html code로 인코딩할 수 있는 것이다.

// ejs : embedded javascript의 약자이다.


var ejs = require("ejs");

var ejsCode = `<!DOCTYPE html>
<html lang="kr">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <%=name%>
    <%=description%>
    <%for(var i=0; i<5; i++){%>
    <h1>hello ejs <%=i%></h1>
    <%}%>
</body>
</html>`;

var htmlCode = ejs.render(ejsCode, {name:"name", description:"desc"});
console.log(htmlCode);