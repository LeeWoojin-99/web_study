// 터미널에서 nodejs를 실행시켜 입력값 받기

var args = process.argv; // console에서 

console.log(args);
// 첫 번째 인자 : node.js의 경로
// 두 번째 인자 : 실행되는 js파일의 경로
// 그 이후의 인자 : 터미널에서 입력된 인수값

console.log(args[2], args[3]);

if(args[2] === '1'){
  console.log('one');
} else {
  console.log('not one');
}