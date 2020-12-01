<?php 

/* Header pour les permission */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

/**
 * - Fonction de connexion à la bdd projetsiterencontre locale
 * - Encodage spécifié : utf8
 */

function connexionPDO(){
    $login = "projavrp_root";
    $mdp = "Les 4 BG !$";
    $bd = "projavrp_projetsiterencontre";
    $serveur = "localhost";
    try{
        $conn = new PDO("mysql:host=$serveur;dbname=$bd;charset=utf8", $login, $mdp);
        return $conn;
    }catch(PDOException $e){
        print "Erreur de connexion PDO";
        die();
    }
}

/**
 * - Fonction de création d'une chaine de caractère de taille 50
 * - caractères utilisés : abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
 */

function str_rand(){
    $res = "";
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    $charArray = str_split($chars);
    for($i = 0; $i < 50; $i++){
        $randChar = array_rand($charArray);
        $res .= $charArray[$randChar];
    }
    return $res;
}


/**
 * - Fonction de vérification du couple id/connecttoken dans la BDD
 *   et met à jour le grade si le premium est arrivé à expiration
 * - Paramètre : id et clé
 * - Sortie : booléen
 */

function isLogged($id, $key){
    $logged = false;
    $grade="";
    $cnx = connexionPDO();
    $req = $cnx -> prepare('SELECT connecttoken,grade,premiumEnd FROM user WHERE id = ?');
    $req -> execute(array($id));
    if ($ligne = $req -> fetch()) {
        if ($ligne != NULL) {
            if($ligne['connecttoken']===$key){
                $logged = true;
            }
            $grade=$ligne['grade'];
        }
    }
    $req -> closeCursor();
    if($grade==="premium"){
        $datetime1 = new DateTime($ligne['premiumEnd']);
        $datetime2 = new DateTime(date("Ymd"));
        $interval = $datetime1->diff($datetime2);
        if($interval->invert===0){
            $req = $cnx -> prepare('UPDATE user SET grade="nouveau" WHERE id = ?');
            $req -> execute(array($id));
            $req -> closeCursor();
        }
    }
    return $logged;
}

/**
 * - Fonction de récupération du grade de la personne
 * - Paramètre : id de la personne
 * - Sortie : String indiquant le grade de l'id
 */

function getGrade($id){
    $grade="";
    $cnx = connexionPDO();
    $req = $cnx -> prepare('SELECT grade FROM user WHERE id=?');
    $req -> execute(array($id));
    if ($ligne = $req -> fetch()) {
        if ($ligne != NULL) {
            $grade=$ligne["grade"];
        }
    }
    $req -> closeCursor();
    return($grade);
}

/**
 * - Fonction qui décrémente le nb de like autorisé par jour
 * et le met à jour si on est le lendemain
 * - Paramètre : id
 * - Sortie : booléen si l'utilisateur n'as pas de droit de like une nouvelle fois
 */

function decNbLike($id){
    $res=false;
    if(getGrade($id)==="nouveau"){
        $cnx = connexionPDO();
        $req = $cnx -> prepare('SELECT nbLike,actuLike FROM user WHERE id = ?');
        $req -> execute(array($id));
        if ($ligne = $req -> fetch()) {
            if ($ligne != NULL) {
                $actuLike=$ligne['actuLike'];
                $nbLike=$ligne['nbLike'];
            }
        }
        $req -> closeCursor();
        if($actuLike===date("Ymd")){
            if($nbLike>0){
                $cnx = connexionPDO();
                $req = $cnx -> prepare('UPDATE user set nbLike=? WHERE id = ?');
                $req -> execute(array($nbLike-1,$id));
                $req -> closeCursor();
                $res=true;
            }else{
                $res=false;
            }
        }else{
            $cnx = connexionPDO();
            $req = $cnx -> prepare('UPDATE user set nbLike=?,actuLike=? WHERE id = ?');
            $req -> execute(array(9,date("Ymd"),$id));
            $req -> closeCursor();
            $res=true;
        }
    }else{
        $res=true;
    }
    return($res);
}   

?>