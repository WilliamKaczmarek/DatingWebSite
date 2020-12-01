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
 *  GET :
 *      id => ID de la personne liké
 * - Sortie : Object :
 *      connected => Vrai ou faux selon l'authenticité du couple (id,token)
 *      dislikes => Tout les ID disliké 
 */

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connected=isLogged($id,$key);
if($ObjIdKey->connected){//l'utilisateur est connecté
    //Regarde si c'est dans le dislike de l'autre
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
    if(in_array($id,$arrayDislikeAutre)){//Tu l'as dislike et il t'as dislike alors ca enleve
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
    }else{//Si l'autre ne t'as pas dislike aussi
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
            $nouveauLike="";
            foreach ($arrayLikeAutre as &$value) {
                if($value!==$id && $value!=""){
                    $nouveauLike .= $value.";";
                }
            }
            $cnx = connexionPDO();
            $req = $cnx -> prepare('UPDATE user set likes=? WHERE id = ?');
            $req -> execute(array($nouveauLike,$_GET["id"]));
            $req -> closeCursor();
        }else{//Tu es le premier à dislike/like
            //Ajout du dislike dans la bdd
            $cnx = connexionPDO();
            $req = $cnx -> prepare('SELECT dislikes FROM user WHERE id = ?');
            $req -> execute(array($id));
            if ($ligne = $req -> fetch()) {
                if ($ligne != NULL) {
                    $ObjIdKey->dislikes=$ligne["dislikes"];
                } else {
                    $ObjIdKey->dislikes="echec";
                }
            }
            $req -> closeCursor();
            if($ObjIdKey->dislikes!=="echec" && $_GET["id"]){
                $ObjIdKey->dislikes .=$_GET["id"].";";
                $cnx = connexionPDO();
                $req = $cnx -> prepare('UPDATE user set dislikes=? WHERE id = ?');
                $req -> execute(array($ObjIdKey->dislikes,$id));
                $req -> closeCursor();
            }
        }
    }
    echo (json_encode($ObjIdKey));
}else{
    print("Couple (id,key) factice.");
}

?>