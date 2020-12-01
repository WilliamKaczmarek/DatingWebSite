<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**

 * - Supression de la carte étudiante d'un utilisateur
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  GET :
 *      id => id de la personne dont on veut supprimer la carte étudiante
 *      img => extension de l'image de la la personne à qui ont supprime la carte
 * - Sortie : Object :
 *      connected => Vrai ou faux selon l'authenticité du couple (id,token)
 *      imageSuppr => failure/success selon la réussite de la suppression
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connected=isLogged($id,$key);
if($ObjIdKey->connected){
    $cnx = connexionPDO();
    $req = $cnx -> prepare('UPDATE user SET carte=NULL WHERE id = ?');
    $req -> execute(array($_GET["id"]));
    if(!(unlink("../imageCarteEtudiante/".$_GET["id"].".".$_GET["img"]))){
        $ObjIdKey->imageSuppr="failure";
    }else{
        $ObjIdKey->imageSuppr="success";
        $req -> closeCursor();
        echo (json_encode($ObjIdKey));
    }
}else{
    print("Couple (id,key) factice.");
}

?>