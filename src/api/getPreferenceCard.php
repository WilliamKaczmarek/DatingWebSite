<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

include "connexionBDD.php";
    
/**

 * - Vérification de la correspondance entre id et key
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  GET : 
 *      id => Id de la personne dont on veut récuperer les informations
 * - Sortie : Object :
 *      connect => Vrai ou faux selon l'authenticité du couple (id,token)
 *      issetGetId => Id selon l'existence de $_GET['id']
 *      issetGetInfo => Vrai ou faux selon l'existence de $_GET['info']
 *      issetGetmyId => Vrai ou faux selon l'existence de $_GET['myId']
 *      tabImage => Tableau de taille 5 avec un booléen indiquant si l'image existe ou non
 *      tabPref => Tableau avec toutes les informations à communiquer lorsqu'on choisi un partenaire
 *      readPref => Vrai ou faux selon si l'on a réussi a récuperer les informations
 *      certif => Indique si l'utilisateur est certifié ou non
 *      myCoor => Coordonnées de l'utilisateur sur le client qui envoi la requête
 */

$ObjIdKey->issetGetId=false;
$ObjIdKey->issetGetInfo=false;
$ObjIdKey->issetGetmyId=false;
 if(isset($_GET['id'])){
    $dossierImage = "../imageProfil/"; 
    $id = $_GET['id'];
    $ObjIdKey->issetGetId=true;
    //Verif de l'existence des fichiers
    $ObjIdKey->tabImage= array(
        file_exists($dossierImage.$id."-1.png"),
        file_exists($dossierImage.$id."-2.png"),
        file_exists($dossierImage.$id."-3.png"),
        file_exists($dossierImage.$id."-4.png"),
        file_exists($dossierImage.$id."-5.png")
    );
    //Récupération des infos
    if(isset($_GET['info']) && $_GET['info']=="yes"){
        $ObjIdKey->issetGetInfo=true;
        $cnx = connexionPDO();
        $req = $cnx -> prepare('SELECT prenom,birthDate,gps,bio,etude,taille,yeux,cheveux,sport,alcool,tabac,animaux,religion,astro FROM user, preference WHERE id = ? AND prefId = ?');
        $req -> execute(array($_GET['id'],$_GET['id']));
        if ($ligne = $req -> fetch()) {
            if ($ligne != NULL) {
                $ObjIdKey->tabPref= array(
                    $ligne['prenom'],
                    $ligne['birthDate'],
                    $ligne['gps'],
                    $ligne['bio'],
                    $ligne['etude'],
                    $ligne['taille'],
                    $ligne['yeux'],
                    $ligne['cheveux'],
                    $ligne['sport'],
                    $ligne['alcool'],
                    $ligne['tabac'],
                    $ligne['animaux'],
                    $ligne['religion'],
                    $ligne['astro']
                );
                $ObjIdKey->readPref=true;
            } else {
                $ObjIdKey->readPref=false;
            }
        }
        $req -> closeCursor();
    }
    //Récupération des coordonnées
    if(isset($_GET['myId'])){
        $ObjIdKey->issetGetmyId=$_GET['myId'];
        $cnx = connexionPDO();
        $req = $cnx -> prepare('SELECT gps FROM preference WHERE prefId = ?');
        $req -> execute(array($_GET['myId']));
        if ($ligne = $req -> fetch()) {
            if ($ligne != NULL) {
                $ObjIdKey->myCoor=$ligne['gps'];
            }
        }
        $req -> closeCursor();
    }
    //Récupération de la certification
    if(isset($_GET['certif'])){
        $ObjIdKey->issetCertif=$_GET['certif'];
        $cnx = connexionPDO();
        $req = $cnx -> prepare('SELECT carte FROM user WHERE id = ?');
        $req -> execute(array($id));
        if ($ligne = $req -> fetch()) {
            if ($ligne != NULL) {
                $ObjIdKey->certif=$ligne['carte'];
            }
        }
        $req -> closeCursor();
    }
}

echo (json_encode($ObjIdKey));


?>