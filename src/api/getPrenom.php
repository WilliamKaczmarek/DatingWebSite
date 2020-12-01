<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

include "connexionBDD.php";

/**
 * - Récupération de l'ID d'un utilisateur selon son mail et son mot de passe
 * - Entrée :
 *  GET : 
 *      mail => adresse mail de l'utilisateur
 *      password => mot de passe hashé avec sha256
 * - Sortie : ObjectRes, NULL, error
 *  ObjectRes :
 *      id => nombre correspondant à l'identifiant de l'utilisateur
 *      key => token correspondant à son id
 *  NULL => Aucun id ne correspond au couple (mail/mdp)
 *  error => Problème durant la connexion à la BDD
 *           ou lors de la requête SQL
 */

try {
    // Connexion/Requête BDD - SELECT
    $cnx = connexionPDO();
    $req = $cnx -> prepare('SELECT id FROM user WHERE mail = ? AND password = ?');
    $req -> execute(array($_GET["mail"], $_GET["password"]));
    if ($ligne = $req -> fetch()) {
        if ($ligne != NULL) {
            $ObjectRes->id=$ligne['id'];
            $token=str_rand();
            $ObjectRes->key=$token;
            $cnx2 = connexionPDO();
            $req2 = $cnx2 -> prepare('UPDATE user SET connecttoken = ? WHERE mail = ?');
            $req2 -> execute(array($token,$_GET["mail"]));
            $req2 -> closeCursor();
            $ObjectResEnc = json_encode($ObjectRes);
            print ($ObjectResEnc);
        } else {
            print(NULL);
        }
    }
    $req -> closeCursor();
} catch (PDOException $e) {
    print "Erreur !".$e -> getMessage();
    die();
}

?>