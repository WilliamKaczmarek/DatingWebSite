<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');


include "connexionBDD.php";

/**
 * - Vérification de la correspondance entre id et key
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 * - Sortie : Object :
 *      connected => Vrai ou faux selon l'authenticité du couple (id,token)
 *      acceptedLike => Vrai ou faux selon le nombre quotidien de like
 *      match => Vrai ou faux selon s'il y a un match ou non
 *      likes => string qui liste les likes de l'utilisateur 
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connected=isLogged($id,$key);
$ObjIdKey->match=false;
if($ObjIdKey->connected){//l'utilisateur a un bon couple(id,key)
    if(decNbLike($id)){
        $ObjIdKey->acceptedLike=true;
        //Verif si lui nous a pas dislike
        $cnx = connexionPDO();
        $req = $cnx -> prepare('SELECT dislikes FROM user WHERE id = ?');
        $req -> execute(array($_GET["id"]));
        if ($ligne = $req -> fetch()) {
            if ($ligne != NULL) {
                $dislikeAutre=$ligne["dislikes"];
            }
        }
        $req -> closeCursor();
        $arrayDislikeAutre=explode(";",$dislikeAutre);
        if(in_array($id,$arrayDislikeAutre)){//Tu l'as like et il t'as dislike alors ca enleve
            $nouveauDislike="";
            foreach ($arrayDislikeAutre as &$value) {
                if($value!==$id && $value!=""){
                    $nouveauDislike .= $value.";";
                }
            }
            $cnx = connexionPDO();
            $req = $cnx -> prepare('UPDATE user set dislikes=? WHERE id = ?');
            $req -> execute(array($nouveauDislike,$_GET["id"]));
            $req -> closeCursor();
        }else{//Tu le like en premier
            //Regarde si c'est dans le like de l'autre
            $cnx = connexionPDO();
            $req = $cnx -> prepare('SELECT likes FROM user WHERE id = ?');
            $req -> execute(array($_GET["id"]));
            if ($ligne = $req -> fetch()) {
                if ($ligne != NULL) {
                    $LikeAutre=$ligne["likes"];
                }
            }
            $req -> closeCursor();
            $arrayLikeAutre=explode(";",$LikeAutre);
            if(in_array($id,$arrayLikeAutre)){//Tu l'as dislike et il t'as like alors ca enleve    
                $ObjIdKey->match=true;
            }
            $cnx = connexionPDO();
            $req = $cnx -> prepare('SELECT likes FROM user WHERE id = ?');
            $req -> execute(array($id));
            if ($ligne = $req -> fetch()) {
                if ($ligne != NULL) {
                    $ObjIdKey->likes=$ligne["likes"];
                } else {
                    $ObjIdKey->likes="echec";
                }
            }
            $req -> closeCursor();
            if($ObjIdKey->likes!=="echec" && $_GET["id"]){
                $ObjIdKey->likes .=$_GET["id"].";";
                $cnx = connexionPDO();
                $req = $cnx -> prepare('UPDATE user set likes=? WHERE id = ?');
                $req -> execute(array($ObjIdKey->likes,$id));
                $req -> closeCursor();
            }
        }
    }else{
        $ObjIdKey->acceptedLike=false;
    }
    echo (json_encode($ObjIdKey));
}else{
    print("Couple (id,key) factice.");
}

?>