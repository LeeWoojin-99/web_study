// callback hell code

class UserStorage{
    loginUser(id, pw, onSuccess, onError){
        setTimeout(() => {
            if(
                (id === "idlwj" && pw === "pwlwj") ||
                (id === "lwjid" && PW === "lwjpw")
            ){
                onSuccess(id);
            }else{
                onError(new Error("not found"));
            }
        }, 2000);
    }

    getRoles(user, onSuccess, onError){
        setTimeout(() => {
            if (user === "idlwj"){
                onSuccess({name:"idlwj", role:"admin"});
            }else{
                onError(new Error("no access"));
            }
        }, 1000);
    }
}

var userStorage = new UserStorage();
var id = prompt("enter your id");
var pw = prompt("enter your pw");
userStorage.loginUser(
    id, // prompt로 입력받은 변수 id
    pw,
    user => { // id와 pw가 조건에 부합한다면 onSuccess(id) 호출
        // onSuccess(id)에서 id는 loginUser()메소드를 호출할 때의 매개변수 id가 사용된다.
        // => 전에 user라는 이름을 선언해주는 것을 통해 매개변수로 입력된 id는 user라는 이름으로 사용할 수 있게 됐다.
        userStorage.getRoles( // loginUser메소드의 콜백함수 onSuccess(id, onSuccess, onError) 호출
            user,
            userWithRole => {alert(userWithRole.name, userWithRole.role);},
            // user와 마찬가지로 onSuccess({name:"idlwj", role:"admin"});에서 매개변수로 입력된 객체는 userWithRole이라는 이름으로 사용할 수 있게 됐다.
            () => {console.log("error");}
        )
    },
    () => {console.log("error");}
)

// 콜백 체인이 길어지면 가독성 저하, 디버그 난이도 상승