// nodejs - 1. Nodejs에서 MySQL을 사용해보기

// node.js에서 MySQL을 이용하기 위해서는 'myslq'이라는 모듈이 필요했다.
// 그래서 npm으로 mysql모듈을 설치하고 사용해보았다.
// ndoe.js에서 MySQL에 접속하여 데이터를 받아와 출력하였다.

var mysql = require("mysql"); // mysql모듈을 mysql이라는 변수로 사용하겠다고 선언
var connection = mysql.createConnection({
    host: "localhost", // 호스트의 이름
    user: "root", // MySQL에 접속하는 유저의 이름
    password: "lwj1316", // 유저의 비밀번호
    database: "opentutorials" // 데이터베이스의 이름
});

connection.connect(); // node.js에서 MySQL에 접속

connection.query("SELECT * FROM topic", function(error, results, fields){
    // connection.query("SQL code", callback function(error, results, fields){...});
    // SQL code : MySQL에서 수행될 동작들을 적는 공간
    // callback function : MySQL에서 동작을 수행하여 나온 결과를 받아서 실행되는 함수
    if(error) console.log(error); // 에러가 있다면 에러를 출력
    console.log(results); // 결과를 출력
    // results : MySQL에서 나온 결과가 담긴 데이터이다.
    // results의 형태는 객체를 원소로 두고있는 배열의 형태이다.
    // [{...}, {...}, ...]
})

connection.end(); // MySQL 접속을 중지