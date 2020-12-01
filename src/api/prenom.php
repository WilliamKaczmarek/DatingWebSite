<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

header('Access-Control-Max-Age: 1000');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');


include "connexionBDD.php";



try {

	$cnx = connexionPDO();
	$id = $_POST["id"];
	$sql = "SELECT prenom FROM user WHERE id = ?";
    $prenom = $cnx-> prepare($sql);
    $prenom -> execute(array($id));
    
    if ($ligne = $prenom -> fetch()) {

        if ($ligne != NULL) {
        	print $ligne["prenom"];
       	}
    }
	$prenom -> closeCursor();
}
catch (PDOException $e){
	print "Erreur !".$e -> getMessage();
    die();
}



?>