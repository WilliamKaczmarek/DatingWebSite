<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, logginid, logginkey');

include "connexionBDD.php";

/**
 * - Upload d'une image compressée au serveur
 * - Entrée :
 *  Headers : 
 *      id => Valeur du cookie ID
 *      key => Valeur du cookie KEY
 * - Sortie : Object :
 *      connect => Vrai ou faux selon l'authenticité du couple (id,token)
 *      MsgCompress => Message renvoyé à l'utilisateur
 *      uploadPath => Path où l'image a été upload
 */


/* 
 * Fonction de compression d'une image pour qu'elle pèse moins lourd
 */ 
function compressImage($source, $destination, $quality) { 
    // Get image info 
    $imgInfo = getimagesize($source); 
    $mime = $imgInfo['mime']; 
     
    // Create a new image from file 
    switch($mime){ 
        case 'image/jpeg': 
            $image = imagecreatefromjpeg($source); 
            break; 
        case 'image/png': 
            $image = imagecreatefrompng($source); 
            break; 
        case 'image/gif': 
            $image = imagecreatefromgif($source); 
            break; 
        default: 
            $image = imagecreatefromjpeg($source); 
    }
    // Save image 
    imagejpeg($image, $destination, $quality); 
     
    // Return compressed image 
    return $destination; 
} 
 

$id = $_SERVER['HTTP_LOGGINID'];
$key = $_SERVER['HTTP_LOGGINKEY'];
$ObjIdKey->connect=isLogged($id,$key);
if($ObjIdKey->connect){
    // File upload path 
    $uploadPath = "../imageProfil/"; 
    
    // If file upload form is submitted 
    $status = $ObjIdKey->MsgCompress = ''; 
    $status = 'error'; 
    if(!empty($_FILES["file"]["name"])) { 
        // File info 
        $fileName = basename($_FILES["file"]["name"]); 

        //Determination du nom du fichier
        if(!file_exists($uploadPath.$id."-1.png")) {
            $imageUploadPath = $uploadPath.$id."-1.png";
        }elseif(!file_exists($uploadPath.$id."-2.png")){
            $imageUploadPath = $uploadPath.$id."-2.png";
        }elseif(!file_exists($uploadPath.$id."-3.png")){
            $imageUploadPath = $uploadPath.$id."-3.png";
        }elseif(!file_exists($uploadPath.$id."-4.png")){
            $imageUploadPath = $uploadPath.$id."-4.png";
        }else{
            $imageUploadPath = $uploadPath.$id."-5.png";
        }
        $ObjIdKey->uploadPath = $imageUploadPath;
        $fileType = pathinfo($imageUploadPath, PATHINFO_EXTENSION); 
        
        // Allow certain file formats 
        $allowTypes = array('jpg','png','jpeg','gif'); 
        if(in_array($fileType, $allowTypes)){ 
        // Image temp source 
        $imageTemp = $_FILES["file"]["tmp_name"]; 
                
            // Compress size and upload image 
            $compressedImage = compressImage($imageTemp, $imageUploadPath, 75); 
                
            if($compressedImage){ 
                //$status = 'success'; 
                $ObjIdKey->MsgCompress = "Image compressée avec succès !"; 
            }else{ 
                $ObjIdKey->MsgCompress = "Compression de l'image echouée !"; 
            } 
        }else{ 
            $ObjIdKey->MsgCompress = 'Désolé, il n\'y a que les JPG, JPEG et PNG qui sont autorisés.'; 
        } 
    }else{ 
        $ObjIdKey->MsgCompress = 'Selectionnez une image à upload.'; 
    } 
}
 
// Display status message 
echo (json_encode($ObjIdKey));
 
?>