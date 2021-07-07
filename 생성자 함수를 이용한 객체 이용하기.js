// JavaScript를 공부하기 위한 파일

// 생성자 함수를 이용한 객체 이용하기
function LWJ(){
    this.value_1 = 1;
    value_2 = 2;
    //function print_value(){...} error code
    //function this.print_value(){...} error code
    //this.print_value = function(){...}
    //function this.print_value(){console.log("print_value");}
    this.print_value = function(){
        //console.log(value_1); error code
        //console.log(this.value_1);
        //console.log(value_2);
        console.log("print_value");
    }
}
var instance = new LWJ();
console.log(instance.value_1);
console.log(instance.value_2); // undefined
// value_2는 객체 내부에서 this없이 선언되었기 때문에 객체 외부에서는 참조할 수 없다.
instance.print_value();

