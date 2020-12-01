<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**

 * - Changement de mot de passe d'un utilisateur
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  POST :
 *      oldMDP => Ancien mot de passe de l'utilisateur
 *      newMDP => Nouveau mot de passe de l'utilisateur
 * - Sortie : Object :
 *      connect => Vrai ou faux selon l'authenticité du couple (id,token)
 *      Message => Message renvoyé à l'utilisateur
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connected=isLogged($id,$key);
$ObjIdKey->Message="Message du PHP";
if($ObjIdKey->connected){
    //Récupération de l'ancien mot de passe
    $cnx = connexionPDO();
    $req = $cnx -> prepare('SELECT `password` FROM user WHERE id = ?');
    $req -> execute(array($id));
    $passBDD="";
    if ($ligne = $req -> fetch()) {
        if ($ligne != NULL) {
            $passBDD=$ligne['password'];;
        }
    }
    $req -> closeCursor();
    //Vérification que l'ancien mot de passe est le même pour mise à
    //jour du mot de passe avec le nouveau
    if($_POST['OldMDP']===$passBDD){
        $cnx = connexionPDO();
        $req = $cnx -> prepare('UPDATE user SET `password`=? WHERE id = ?');
        $req -> execute(array($_POST['NewMDP'],$id));
        $req -> closeCursor();
        $ObjIdKey->Message="Mot de passe changé !";
    }else{
        $ObjIdKey->Message="Votre ancien mot de passe ne correspond pas.";
    }
    echo (json_encode($ObjIdKey));
}else{
    echo (json_encode($ObjIdKey));
}

?>