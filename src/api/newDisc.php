<?php



include "connexionBDD.php";

try {
	$cnx = connexionPDO();
	$id = $_SERVER['HTTP_LOGGINID'];
	$key = $_SERVER['HTTP_LOGGINKEY'];
	if (isLogged($id,$key)) {
		$name = "d".$id."_".$_POST["id2"];
		$req = $cnx -> prepare("CREATE TABLE `".$name."` (
		id INT(11) UNSIGNED,
		message VARCHAR(300) NOT NULL);
		INSERT INTO listeMatch(`id`,`id2`) VALUES (?,?) ");
		$req -> execute(array($id,$_POST["id2"]));
    	$req -> closeCursor();
    	print '1';
	} else {
		print '2';
		die();
	}
	
}
catch (PDOException $e){
	print "Erreur !".$e -> getMessage();
    die();
}


?>