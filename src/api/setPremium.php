<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**

 * - Promotion de l'utilisateur au grade de premium lorsqu'il a payé
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  POST :
 *      num => correspondrait au numéro de la carte bancaire
 *      pin => correspondrait au code à 3 chiffre au dos de la carte
 * - Sortie : Object :
 *      connect => Vrai ou faux selon l'authenticité du couple (id,token)
 *      Message => Message à renvoyer à l'utilisateur
 *      oldDate => Ancienne date de la BDD
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connected=isLogged($id,$key);
if($ObjIdKey->connected){
    //Vérification de la correspondance du numéro/pin
    if(isset($_POST["pin"]) && isset($_POST["num"]) && $_POST["num"]==="30092000" && $_POST["pin"]==="Théo"){
        $cnx = connexionPDO();
        //Mise à joru du grade
        $req = $cnx -> prepare('UPDATE user SET grade="premium" WHERE id = ?');
        $req -> execute(array($id));
        $req -> closeCursor();
        $req = $cnx -> prepare('SELECT premiumEnd FROM user WHERE id = ?');
        $req -> execute(array($id));
        if ($ligne = $req -> fetch()) {
            if ($ligne != NULL) {
                $ObjIdKey->oldDate=$ligne["premiumEnd"];
            } else {
                $ObjIdKey->oldDate="echec";
            }
        }
        $req -> closeCursor();
        $ObjIdKey->Message="Vous êtes désormais premium";
        /* Definition de la durée à rajouter puis calcul au niveau des dates
            pour savoir si l'abonnement s'additionne à l'ancien ou commence à partir d'aujourd'hui
            puis ajouter la durée demandée*/
        if($ObjIdKey->oldDate!=="echec"){
            if($_POST["time"]==="6"){
                $intervalText="P180D";
            }elseif ($_POST["time"]==="3") {
                $intervalText="P90D";
            }else{
                $intervalText="P30D";
            }
            $datetime1 = new DateTime($ObjIdKey->oldDate);
            $datetime2 = new DateTime(date("Ymd"));
            $interval = $datetime1->diff($datetime2);
            if($interval->invert===1){
                $dateBegin=new DateTime($ObjIdKey->oldDate);
            }else{
                $dateBegin= new DateTime(date("Ymd"));
            }
            $dateBegin->add(new DateInterval($intervalText));
            $req = $cnx -> prepare('UPDATE user SET premiumEnd=? WHERE id = ?');
            $req -> execute(array($dateBegin->format('Ymd'),$id));
            $req -> closeCursor();
            $ObjIdKey->Message="Vous êtes désormais premium jusqu'au ".$dateBegin->format('d/m/Y');
        }
    }else{
        //Mauvais code
        $ObjIdKey->Message="Mauvaise combinaison numéro-PIN";
    }
    echo (json_encode($ObjIdKey));
}else{
    //Utilisateur non connecté
    $ObjIdKey->Message="Veuillez vous connecter";
    echo (json_encode($ObjIdKey));
}
?>