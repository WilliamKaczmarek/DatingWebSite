<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

header('Access-Control-Max-Age: 1000');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');



include "connexionBDD.php";



/**

 * - Ajout d'un nouveau compte dans la BDD en vérifiant l'unicité du mail

 * - Entrée :

 *  POST : 

 *      email => adresse mail de l'utilisateur

 *      password => mot de passe hashé avec sha256

 *      nom => nom de famille de l'utilisateur

 *      prenom => prénom de l'utilisateur

 *      birthDate => date de naissance utilisateur (format: aaaa/mm/jj)

 *      ville => ville où habite l'utilisateur

 * - Sortie : 0, 1, error

 *  0 => L'adresse mail existe déjà dans la BDD

 *  1 => Compte ajouté avec succès

 *  error => Problème durant la connexion à la BDD

 *           ou lors de la requête SQL

 */



/* Unicité de l'adresse mail */

try {

    // Connexion/Requête BDD - SELECT

    $cnx = connexionPDO();

    $req = $cnx -> prepare('SELECT id FROM user WHERE mail = ?');

    $req -> execute(array($_POST["email"]));

    if ($ligne = $req -> fetch()) {

        if ($ligne != NULL) {

            print '0';

            die();

        }

    }

    //Pas d'adresse mail similaire trouvée

    $req -> closeCursor();

} catch (PDOException $e) {

    print "Erreur !".$e -> getMessage();

    die();

}



/* Création du compte */

try {

    // Connexion/Requête BDD - INSERT
    //Ajout du User
    $cnx = connexionPDO();
    $req = $cnx -> prepare('INSERT INTO user(`mail`,`password`,`nom`,`prenom`,`birthDate`) 
    VALUES (?,?,?,?,?)');
    $req -> execute(array($_POST["email"],$_POST["password"],$_POST["nom"],$_POST["prenom"],$_POST["dateBirth"]));
    $req -> closeCursor();

    $cnx = connexionPDO();
    $req = $cnx -> prepare('SELECT id FROM user WHERE mail = ? AND password = ?');
    $req -> execute(array($_POST["email"],$_POST["password"]));
    if ($ligne = $req -> fetch()) {
        $id=$ligne['id'];
    }
    $req -> closeCursor();
    $cnx = connexionPDO();
    $req = $cnx -> prepare('INSERT INTO preference(`prefId`,`ville`,`gps`) 
    VALUES (?,?,?)');
    $req -> execute(array($id,$_POST["ville"],$_POST["coor"]));
    $req -> closeCursor();
    print '1';

} catch (PDOException $e) {

    print "Erreur !".$e -> getMessage();

    die();

}



?>