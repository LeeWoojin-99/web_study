var rabbit = {
    "name" : "tori",
    "color" : "white",
    "age" : 2,
    "size" : null,
    "func" : () => {
        console.log("hello func");
    }
}

var json = JSON.stringify(rabbit, (key, value) => {
    console.log("key : " + key + ", value : " + value);
    return key === "name" ? "LWJ" : value;
});

console.log(json);