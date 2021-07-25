var rabbit = {
    "name" : "tori",
    "color" : "white",
    "age" : 2,
    "size" : null,
    "func" : () => {
        console.log("hello func");
    },
    "birthDate" : new Date()
}

var json = JSON.stringify(rabbit);

console.log("json : " + json);
console.log();

var obj = JSON.parse(json, (key, value) =>{
    console.log("key : " + key + ", value : " + value);
    return key === "birthDate" ? new Date(value) : value;
})
console.log(obj.birthDate.getDate());

// var obj = JSON.parse(json)
// console.log(obj.birthDate.getDate()); // error code
// reviver가 없이 parse를 사용하여 변환한 데이터는 value값이 string 자료형의 데이터로 변환되었기 때문에
// 객체로서 사용될 수 없다.
// 그래서 reviver에서 birthDate의 value값을 new Date(value)로 바꿔줌으로서 객체로 사용될 수 있게 하면
// 객체로서 사용될 수 있다.