<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**
 * - Met à jour le profil de l'utilisateur
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  POST :
 *      Toutes les information relatives à un profil
 * - Sortie : Object :
 *      connect => Vrai ou faux selon l'authenticité du couple (id,token)
 *      status => état de l'opération
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->status = "failure";
$ObjIdKey->connect=isLogged($id,$key);
if($ObjIdKey->connect && isset($_POST)){
    $cnx = connexionPDO();
    //Mise à jour des nouvelles valeurs du profil de l'utilisateur
    $req = $cnx -> prepare('UPDATE preference SET 
    jeSuis = ?,
    ville = ?,
    gps = ?,
    jeCherche = ?,
    butRencontre = ?,
    trancheAge = ?,
    bio = ?,
    etude = ?,
    taille = ?,
    yeux = ?,
    cheveux = ?,
    sport = ?,
    alcool = ?,
    tabac = ?,
    animaux = ?,
    religion = ?,
    astro = ?
    WHERE prefId = ?');
    $req -> execute(array(
        $_POST['jeSuis'],
        $_POST['Ville'],
        $_POST['Coor'],
        $_POST['jeCherche'],
        $_POST['But'],
        $_POST['TrancheAge'],
        $_POST['Description'],
        $_POST['Etudes'],
        $_POST['Taille'],
        $_POST['Yeux'],
        $_POST['Cheveux'],
        $_POST['Sport'],
        $_POST['Alcool'],
        $_POST['Tabac'],
        $_POST['Animaux'],
        $_POST['Religion'],
        $_POST['Astro'],
        $id
    ));
    $req -> closeCursor();
    $ObjIdKey->status = "success";
}
echo (json_encode($ObjIdKey));

?>