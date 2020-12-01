<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

header('Access-Control-Max-Age: 1000');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');


include "connexionBDD.php";



try {

	$cnx = connexionPDO();
	$id = $_POST["id"];
	$id2 = $_POST["id2"];
	$match = "d".$id."_".$id2;
	$sql = "SELECT * FROM `".$match."`";
    $messages = $cnx-> prepare($sql);
    $messages -> execute();
    foreach ($messages as $row) {
        	print $row["id"] . "-" . $row["message"].";";
    }
	$messages -> closeCursor();
}
catch (PDOException $e){
	print "Erreur !".$e -> getMessage();
    die();
}



?>