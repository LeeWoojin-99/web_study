<?php
$name = (isset($_POST['userName'])) ? $_POST['userName'] : 'no name';
$computedString = "안녕, " . $name . "!";
$array = ['userName' => $name, 'computedString' => $computedString];
echo json_encode($array); // json 데이터로 응답
?>