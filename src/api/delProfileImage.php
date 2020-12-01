<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**

 * - Supression d'une image de profil
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  POST :
 *      number => numéro de l'image à supprimer
 * - Sortie : Object :
 *      connected => Vrai ou faux selon l'authenticité du couple (id,token)
 *      numImage => numéro de l'image qui sera supprimée
 *      deletion => Message pour le client
 *      isDel => Vrai ou faux selon la réussite de la suppression de l'image
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connect=isLogged($id,$key);
$ObjIdKey->numImage=$_POST['number'];
$ObjIdKey->deletion="Non connecté";
$ObjIdKey->isDel=false;
if($ObjIdKey->connect){
    $uploadPath = "../imageProfil/";
    $ObjIdKey->deletion="No _POST['number']";
    if(isset($_POST['number'])){
        if(!($_POST['number']=="1" || $_POST['number']=="2"  || $_POST['number']=="3" || $_POST['number']=="4" || $_POST['number']=="5")){
            $ObjIdKey->deletion="Number non valide : ".$_POST['number'];
        }elseif(!(unlink($uploadPath.$id."-".$_POST['number'].".png"))){
            $ObjIdKey->deletion="Erreur dans la suppression du fichier, path : ".$uploadPath.$id."-".$_POST['number'].".png";
        }else{
            $ObjIdKey->deletion="Fichier supprimé !";
            $ObjIdKey->isDel=true;
        }
    }   
}
echo (json_encode($ObjIdKey));
?>