<?php
    // 통신 요청을 보내는 html파일과 같은 폴더에 있는 ajax - post php.php
    echo json_encode(array("name"=>$_REQUEST["name"], "age"=>$_REQUEST["age"]));
    // json_encode(x) : x를 json 데이터로 변환
?>