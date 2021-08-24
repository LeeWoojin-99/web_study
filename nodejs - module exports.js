// module : 여러 기능들에 관한 코드가 모여있는 하나의 파일
// 유지보수성, 네임스페이스화, 재사용성
// 모듈을 불러올 때는 require(), 모듈을 해당 스코프 밖으로 보낼 때에는 module.export를 사용한다.

var object = {
    string: "Hello Module",
    method: function(){
        console.log(this.string);
    }
}
var arr = () =>{
    console.log("hello arr");
};

// module.exports.object = object;
exports.object = object;
exports.arr = arr;

// module 객체
// module.exports의 module은 현재 모듈에 대한 정보를 갖고 있는 객체이다. 이는 예약어이며 그 안에 id, path, parent 등의 속성이 있고 exports 객체를 가지고 있다.

// 초기의 module객체의 exports속성은 빈 객체를 참조한다.
// exports는 module.exports를 참조한다.

// require은 항상 module.exports를 리턴받는다.
// 다른 파일에서 require()로 이 파일을 불러온다면 이 파일의 module.exports를 반환받는다는 의미이다.

// console.log(module.exports);
// {
//     object: { string: 'Hello Module', method: [Function: method] },
//     arr: [Function: arr]
// }