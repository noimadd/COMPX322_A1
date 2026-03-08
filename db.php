<?php
    $host = 'localhost'; 
    $dbname = '322_assignment_one';
    $username = 'root';
    $password = '';

    // initiate connection
    $con = mysqli_connect($host, $username, $password, $dbname);

    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    } 

    mysqli_set_charset($con, "utf8");
?>