// js - 인자값의 개수를 부족하게 함수를 호출하였을 때
// 함수에 정해진 인자값의 개수보다 부족하게 인수값을 주어서 함수를 호출했을 때 어떤 동작이 이루어질까 ?

function abc(a, b, c){
    console.log(a, b, c);
    return a+b+c;
}
console.log(abc(1,2,3));
console.log(abc(1,2));

// 함수의 정해진 인자값에 모두 매칭되게 인수값을 입력해주지 않아도 함수는 정상적으로 실행된다.
// 매칭되는 값이 없는 인자값은 undefined가 된다.