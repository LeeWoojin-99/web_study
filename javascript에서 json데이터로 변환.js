function filter(key, value) {
    // undefined: 반환하지 않음
    return typeof value === 'number' ? undefined : value;
    // value값의 타입이 number가 맞다면 undefined, 다르다면 value값 반환
}

var js_object = {name:"lee", gender:"male", age:"23", number:123};
var json_object = JSON.stringify(js_object);
// JSON.stringify(x) : x를 JSON형식의 문자열로 변환
// 객체를 인수값으로 주어서 JSON형식의 문자열로 변환
console.log(typeof(js_object) + "\n" + js_object);
console.log(typeof(json_object) + "\n" + json_object);
console.log("");

var js_arr = [1,2,"12"];
var json_arr = JSON.stringify(js_arr);
// 배열을 인수값으로 주어서 JSON형식의 문자열로 변환
console.log(typeof(js_arr) + "\n" + js_arr);
console.log(typeof(json_arr) + "\n" + json_arr);
console.log("");

console.log("filter\n"+JSON.stringify(js_object, filter));
// stringify 메소드의 두 번째 인수값을 함수로 줄 수 있다.
// 첫 번째 인수값들이 두 번째 인수값을 거친 값을
// JSON형식의 문자열로 변환한 값을 리턴한다.