<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

header('Access-Control-Max-Age: 1000');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');





include "connexionBDD.php";

try {
	$cnx = connexionPDO();
	$id = $_SERVER['HTTP_LOGGINID'];
	$sql = "SELECT * FROM listeMatch";
    $match = $cnx-> prepare($sql);
    $match -> execute();
    foreach ($match as $row) {
        	if ($row["id"]==$id or $row["id2"]==$id) {
        		print $row["id"] . "-" . $row["id2"].";";
        	}
    }
	$match -> closeCursor();
}
catch (PDOException $e){
	print "Erreur !".$e -> getMessage();
    die();
}
?>
