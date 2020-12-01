<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**
 * Calcule l'age
 */
function age($date) { 
    $age = date('Y') - $date; 
   if (date('md') < date('md', strtotime($date))) { 
       return $age - 1; 
   } 
   return $age; 
} 

/**

 * - Vérification de la correspondance entre id et key
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 *  POST 
 *      filtre => Indique le filtre à appliquer
 *      certification => indique si l'on souhaite uniquement des personnes certifiée ou non
 *      tableau => Tableau contenant les critère que l'utilisateur recherche (sous forme booléenne)
 * - Sortie : Object :
 *      connect => Vrai ou faux selon l'authenticité du couple (id,token)
 *      tab => Tableau de l'id des prétendants correpondant à la recherche
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$arrayLikes;
$arrayDislikes;
$mySearch=array("Hommes");
$myTrancheMin="17";
$myTrancheMax="37";
$ObjIdKey->connected=isLogged($id,$key);
if($ObjIdKey->connected){
    //Récupération de ce que cherche et de l'age de ceux que l'utilisateur veut rencontrer
    $cnx = connexionPDO();
    $req = $cnx -> prepare('SELECT jeCherche,trancheAge FROM preference WHERE prefId=?');
    $req -> execute(array($id));
    if ($ligne = $req -> fetch()) {
        if ($ligne != NULL) {
            if($ligne['jeCherche']==="Hommes"){
                $mySearch=array("Homme"); 
            }elseif($ligne['jeCherche']==="Femmes"){
                $mySearch=array("Femme");
            }else{
                $mySearch=array("Femme","Homme","Vivant");
            }
            $myTrancheMin=explode("-",$ligne['trancheAge'])[0];
            $myTrancheMax=explode("-",$ligne['trancheAge'])[1];
        }
    }
    $req -> closeCursor();

    //Récupération des likes/dislikes précédents de l'utilisateur
    $req = $cnx -> prepare('SELECT likes,dislikes FROM user WHERE id=?');
    $req -> execute(array($id));
    if ($ligne = $req -> fetch()) {
        if ($ligne != NULL) {
            $arrayLikes = explode(";",$ligne['likes']);
            $arrayDislikes = explode(";",$ligne['dislikes']);
        }
    }
    $req -> closeCursor();

    //Récupération de tout les utilisateur sauf celui dont le client envoi la requête
    //Tri selon si on a déjà like/dislike un utilisateur
    $req = $cnx -> prepare('SELECT * FROM user WHERE id!= ? ORDER BY user.id ASC');
    $req -> execute(array($id));
    $ObjIdKey->tab= array();
    foreach ($req as $row) {
        if(!(in_array($row["id"],$arrayLikes) || in_array($row["id"],$arrayDislikes))){
            $ObjIdKey->tab[] = $row["id"];
        }
    }
    $req -> closeCursor();

    //Traitement de l'age
    $arrTemp=array();
    foreach ($ObjIdKey->tab as &$valueId1) {
        
        $req = $cnx -> prepare('SELECT birthDate FROM user WHERE id= ?');
        $req -> execute(array($valueId1));
        if ($ligne = $req -> fetch()) {
            if ($ligne != NULL) {
                $sonAge=age($ligne['birthDate']);
            }
        }
        if($sonAge>=$myTrancheMin && $sonAge<=$myTrancheMax){
            $arrTemp[] = $valueId1;
        }
        $req -> closeCursor();
    }
    $ObjIdKey->tab=$arrTemp;
    unset($arrTemp);

    //Traitement du sexe recherché
    $arrTemp=array();
    foreach ($ObjIdKey->tab as &$valueId1) {
        
        $req = $cnx -> prepare('SELECT jeSuis FROM preference WHERE prefId= ?');
        $req -> execute(array($valueId1));
        if ($ligne = $req -> fetch()) {
            if ($ligne != NULL) {
                if(in_array($ligne['jeSuis'],$mySearch)){
                    $arrTemp[] = $valueId1;
                }
            }
        }
        $req -> closeCursor();
    }
    $ObjIdKey->tab=$arrTemp;
    unset($arrTemp);

    /* On récupère les informations que l'utilisateur veut et ensuite on tri 
        les prétendants en fonctions de s'il rentre dans les critères ou non
        Méthode : mise des critères que l'utilisateur recherche dans un tableau
        puis on regarde pour chaque prétendant si son critère appartient au tableau
     */
    //Filtre de la certification
    if(isset($_POST["filtre"])){
        if(isset($_POST["certificate"]) && $_POST["certificate"]==="true"){
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                $req = $cnx -> prepare('SELECT carte FROM user WHERE id= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if($ligne['carte']==="1"){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
        }
        //Filtre des animaux
        if($_POST["filtre"]==="Animaux"){
            $Filtre=json_decode($_POST["tableau"]);
            $arrayAnimaux=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arrayAnimaux[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT animaux FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['animaux'],$arrayAnimaux)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        //Filtre des études
        }elseif($_POST["filtre"]==="Etudes"){
            $Filtre=json_decode($_POST["tableau"]);
            $arrayEtudes=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arrayEtudes[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT etude FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['etude'],$arrayEtudes)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        //Filtre du sport
        }elseif($_POST["filtre"]==="Activités Physique"){
            $Filtre=json_decode($_POST["tableau"]);
            $arraySport=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arraySport[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT sport FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['sport'],$arraySport)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        //Filtre des yeux
        }elseif($_POST["filtre"]==="Yeux"){
            $Filtre=json_decode($_POST["tableau"]);
            $arrayYeux=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arrayYeux[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT yeux FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['yeux'],$arrayYeux)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        //Filtre des cheveux
        }elseif($_POST["filtre"]==="Cheveux"){
            $Filtre=json_decode($_POST["tableau"]);
            $arrayCheveux=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arrayCheveux[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT cheveux FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['cheveux'],$arrayCheveux)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        //Filtre de l'alcool
        }elseif($_POST["filtre"]==="Alcool"){
            $Filtre=json_decode($_POST["tableau"]);
            $arrayAlcool=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arrayAlcool[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT alcool FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['alcool'],$arrayAlcool)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        //Filtre du tabac
        }elseif($_POST["filtre"]==="Tabac"){
            $Filtre=json_decode($_POST["tableau"]);
            $arrayTabac=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arrayTabac[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT tabac FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['tabac'],$arrayTabac)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        //Filtre de la religion
        }elseif($_POST["filtre"]==="Religion"){
            $Filtre=json_decode($_POST["tableau"]);
            $arrayReligion=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arrayReligion[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT religion FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['religion'],$arrayReligion)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        //Filtre du signe astrologique
        }elseif($_POST["filtre"]==="Astrologie"){
            $Filtre=json_decode($_POST["tableau"]);
            $arrayAstrologie=array();
            foreach ($Filtre as &$valusss) {
                if($valusss->value===1){
                    $arrayAstrologie[]=$valusss->name;
                }
            }
            $arrTemp=array();
            foreach ($ObjIdKey->tab as &$valueId1) {
                
                $req = $cnx -> prepare('SELECT astro FROM preference WHERE prefId= ?');
                $req -> execute(array($valueId1));
                if ($ligne = $req -> fetch()) {
                    if ($ligne != NULL) {
                        if(in_array($ligne['astro'],$arrayAstrologie)){
                            $arrTemp[]=$valueId1;
                        }
                    }
                }
            }
            $ObjIdKey->tab=$arrTemp;
            unset($arrTemp);
            unset($Filtre);
        }
    }




    echo (json_encode($ObjIdKey));
}else{
    print("Couple (id,key) factice.");
}

?>