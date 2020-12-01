<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**
 * - Obtention de l'extension de la carte étudiante d'un id
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  GET : 
 *      id => ID de la personne à obtenir l'extension de sa carte
 * - Sortie : Object :
 *      connect => Vrai ou faux selon l'authenticité du couple (id,token)
 *      extension => Extension de la carte étudiante
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connected=isLogged($id,$key);
if($ObjIdKey->connected){
    $cnx = connexionPDO();
    $req = $cnx -> prepare('SELECT carte FROM user WHERE id = ?');
    $req -> execute(array($_GET["id"]));
    if ($ligne = $req -> fetch()) {
        if ($ligne != NULL) {
            $ObjIdKey->extension=$ligne["carte"];
        } else {
            $ObjIdKey->extension="echec";
        }
    }
    $req -> closeCursor();
    echo (json_encode($ObjIdKey));
}else{
    print("Couple (id,key) factice.");
}

?>