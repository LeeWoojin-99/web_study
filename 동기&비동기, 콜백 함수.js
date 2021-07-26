// 동기 : 직렬적으로 작업을 수행
// 비동기 : 병렬적으로 작업을 수행
// callback function (콜백 함수) : 특정 함수에 매개변수로 전달된 함수를 의미한다.
// callback (콜백) : 매개변수로 전달된 함수를 호출하는 것
// 나중에 call(콜백 함수를 매개변수로 가지는 함수를 호출)하면 back(콜백 함수가 실행)하는 함수이다.

// Synchronous callback
// 동기적 콜백 : 동기적으로 콜백함수를 사용하는 것
function printImmediately(print){console.log(print)};
printImmediately("동기적 콜백")

// Asynchronous callback
// 비동기적 콜백 : 비동기적으로 콜백함수를 사용하는 것
function print(print, time){
    setTimeout(() => console.log(print), time);
    // setTimeout() : 지정한 시간(time)이 지나면 지정된 콜백 함수(()=>console.log(print))를 실행하는 메서드
}
print("비동기적 콜백", 1000);
print("비동기적 콜백", 2000);
