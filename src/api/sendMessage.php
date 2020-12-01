<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

header('Access-Control-Max-Age: 1000');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');


include "connexionBDD.php";



try {

	$cnx = connexionPDO();
	$sendID = $_SERVER['HTTP_LOGGINID'];
	$id = $_POST["id"];
	$id2 = $_POST["id2"];
	$message = $_POST["message"];
	$match = "d".$id."_".$id2;
	$sql = "INSERT INTO `".$match."`(`id`,`message`) VALUE (?,?);";
    $send = $cnx-> prepare($sql);
    $send -> execute(array($sendID,$message));
    print "1";
	$send -> closeCursor();
}
catch (PDOException $e){
	print "Erreur !".$e -> getMessage();
    die();
}



?>