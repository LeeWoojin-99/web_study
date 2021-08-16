// nodejs에서 file list 받아오기

var folderDir = './subject_list';
var fs = require('fs');
 
fs.readdir(folderDir, function(error, filelist){
    console.log(filelist);
})