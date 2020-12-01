<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**

 * - Certifie un utilisateur et supprime sa carte étudiante
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  GET :
 *      id => Id de la personne à certifier
 * - Sortie : Object :
 *      connect => Vrai ou faux selon l'authenticité du couple (id,token)
 *      imageSuppr => Indique l'état de la suppression de la carte étudiante
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connected=isLogged($id,$key);
if($ObjIdKey->connected){
    $cnx = connexionPDO();
    $req = $cnx -> prepare('UPDATE user SET carte="1" WHERE id = ?');
    $req -> execute(array($_GET["id"]));
    if(!(unlink("../imageCarteEtudiante/".$_GET["id"].".".$_GET["img"]))){
        $ObjIdKey->imageSuppr="failure";
        $req -> closeCursor();
        echo (json_encode($ObjIdKey));
    }else{
        $ObjIdKey->imageSuppr="success";
        $req -> closeCursor();
        echo (json_encode($ObjIdKey));
    }
}else{
    print("Couple (id,key) factice.");
}

?>