// template literal
// ` : template literal의 시작과 끝을 나타내는 기호
// ${}

var my_name = "이우진";

console.log("변수가..${my_name}..사용되지 않음"); // "로 감싸면 ${}을 사용할 수 없음
console.log(`변수의 사용..${my_name}..변수의 사용`); // `로 감싸야 ${}을 사용할 수 있다.


console.log(`줄바꿈이
편리해짐`) // 또한 줄바꿈을 \n로 하지 않고 그냥 enter키로 할 수 있다.

console.log(`${Array(4).join(my_name)}`); // ${}에서 중괄호의 안에 표현식을 사용할 수도 있다.