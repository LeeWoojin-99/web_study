var text = "a,b,c,d";
console.log("text = " + text);
text = text.split(",");
console.log("text.split(',') = " + text);
for(i in text){
    console.log(text[i]);
}