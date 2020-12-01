import React, { Component } from 'react';

import {URL_API} from '../App';

/**
 * Class pour le formulaire d'inscription dans la page de connexion
 */
class Register extends Component{
    constructor(props) {
        super(props);

        this.state = {
          //Valeur des input email, password, prenom, nom, dateBirth, ville et StudentCard
          email: "", password : "", verifPassword : "", prenom : "", nom : "", dateBirth : "", ville : "",
          StudentCard: null,
          comptStrenghMdp:0,
          alertShow:false, alertMessage:"", alertClass:"alert-danger", //Affichage, type et définition du message de l'alert
          name: "", context:null, lat: null, long: null, //Resultat de l'API, ville et coordonnées GPS
          etape: 0 //0 -> Creation du compte; 1 -> Upload carte étudiante; 2 -> Création du compte terminée
        };
      }

      /**
       * Renvoi la date actuelle à laquelle on a retiré 15*365 jours
       */
      fifteenYearsAgo(){
        let curr = new Date();
        curr.setDate(curr.getDate()-365*15);
        return (curr.toISOString().substr(0,10));
      }

      /**
       * Calcul de la force du mot de passe en fonction de :
       * - Majuscule
       * - Miniscule
       * - Caractère spécial
       * - Chiffre
       * @param {string} mdp Mot de passe du champs mot de passe 
       */
      verifStrength(mdp){
        const LETTRE_MIN="abcdefghijklmnopqrstuvwxyz";
        const LETTRE_MAJ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const CHIFFRE="0123456789";
        let maj=0,min=0,chi=0,spe=0;
        for(let i=0 ; i<mdp.length ; i++){
          if(LETTRE_MIN.indexOf(mdp[i]) !== -1){
            min=1;
          }else if(LETTRE_MAJ.indexOf(mdp[i]) !== -1){
            maj=1;
          }else if(CHIFFRE.indexOf(mdp[i]) !== -1){
            chi=1;
          }else{
            spe=1;
          }
        }
        this.setState({
          comptStrenghMdp:maj+min+chi+spe
        });
      }

      /**
       * Renvoie vrai si le formulaire est estimé complet et correct
       * Renvoi faux si le formulaire est estimé incomplet ou incorrect
       * Effectue une suite de vérification sur la valeur des inputs
       */
      verif(){ //Vérification de la véracité des données
        let positionArobase= this.state.email.indexOf("@");
        if(this.state.email===""){ //Chaîne vide
          this.setState({alertMessage: "Votre e-mail n'est pas précisé."});
          return false;
        }else if(this.state.email.indexOf("@")===-1){ //Ne contient pas de @
          this.setState({alertMessage: "Votre e-mail n'est pas correcte."});
          return false;
        }else if(!(this.state.email.indexOf(".com",positionArobase) !== -1 ||
        this.state.email.indexOf(".fr",positionArobase) !== -1 ||
        this.state.email.indexOf(".eu",positionArobase) !== -1 ||
        this.state.email.indexOf(".org",positionArobase) !== -1 ||
        this.state.email.indexOf(".net",positionArobase) !== -1)){ //Ne fini pas par .com/.fr/.eu/.org/.net
          this.setState({alertMessage: "Votre e-mail doit finir par .com/.fr/.eu/.org/.net."});
          return false;
        }
        if(this.state.password.length < 6){ //Taille mdp inférieure à 6
          this.setState({alertMessage: "Votre mot de passe doit contenir au moins 6 caractères."});
          return false;
        }else if(this.state.password!==this.state.verifPassword){
          this.setState({alertMessage: "Vos mots de passe ne correspondent pas."});
          return false;
        }
        if(this.state.nom.length < 2 || this.state.nom.length < 2){ //Taille nom et prenom => 2
          this.setState({alertMessage: "Vous n'avez pas renseignez votre nom/prénom."});
          return false;
        }
        if(this.state.name===""){this.setState({name:this.state.ville});}
        if(this.state.name.length < 2){ //Taille ville => 2
          this.setState({alertMessage: "Vous n'avez pas renseignez votre ville."});
          return false;
        }
        if(this.state.dateBirth===""){
          this.setState({alertMessage: "Votre date de naissance n'est pas précisée."});
          return false;
        }
        return true;
      }

      /**
       * Envoie les données du 1er formulaire avec les coordonnées de la ville
       * au serveur pour pouvoir creer un compte
       * @param {event} event Action du 1er form par le bouton Submit
       */
      sendAccount(event) {
        event.preventDefault();
        const axios = require('axios');  //Requêtes HTTP
        const sha256 = require('hash-anything').sha256; //Hash du mdp

        if(!this.verif()){ //Un des champs mal rempli
          this.setState({alertShow:true});
        }else{
          let formData = new FormData();
          formData.append('email',this.state.email.toLowerCase());
          formData.append('password',sha256(this.state.password));
          formData.append('prenom',this.state.prenom);
          formData.append('nom',this.state.nom);
          formData.append('dateBirth',this.state.dateBirth);
          formData.append('ville',this.state.name);
          formData.append('coor',this.state.lat+";"+this.state.long);
          const url = URL_API+'newUser.php';
          axios.post(url,formData)
          .then(res => {
            if(res.data>=0){
              switch(res.data){
                case 0:
                  this.setState({
                    alertMessage: "L'adresse mail existe déjà.",
                    alertClass:"alert-danger",
                  });
                  break;
                case 1:
                  this.setState({
                    alertClass:"alert-primary",
                    alertMessage: "Compte crée avec succès !",
                    etape:1
                  });
                  break;
                default:
                  this.setState({alertMessage: "La réponse de l'API n'est pas celle attendue."});
              }
              this.setState({alertShow: true});
            }else{
              console.error('Problème dans le retour de l\'API/newUser.');
            }
          })
          .catch(err => {
            console.log(err);
          });
        }
      }
      
      /**
       * Envoie de la valeur du champ file au serveur pour faire vérifier
       * la carte étudiante par les modérateurs
       * @param {event} event Action du 2nd form par le bouton Submit
       */
      sendCard(event){
        event.preventDefault();
        const axios = require('axios');  //Requêtes HTTP
        
        let formData = new FormData();
        formData.append('file',this.state.StudentCard);
        formData.append('email',this.state.email.toLowerCase());

        const url = URL_API+'setCarteEtudiante.php';
          axios.post(url,formData)
          .then(res => {
            if(res.data>=0){
              switch(res.data){
                case 0:
                  this.setState({
                    alertMessage: "Aucune carte étudiante n'a été envoyée.",
                    alertClass:"alert-secondary",
                    etape:2
                  });
                  break;
                case 1:
                  this.setState({
                    alertClass:"alert-primary",
                    alertMessage: "Carte étudiante envoyée avec succès !",
                    etape:2
                  });
                  break;
                case 2:
                  this.setState({
                    alertClass:"alert-danger",
                    alertMessage: "Votre image dépasse 2Mo !",
                  });
                  break;
                case 3:
                  this.setState({
                    alertClass:"alert-danger",
                    alertMessage: "L'extension de votre image n'est pas acceptée !",
                  });
                  break;
                default:
                  this.setState({alertMessage: "La réponse de l'API n'est pas celle attendue."});
              }
              this.setState({alertShow: true});
            }else{
              this.setState({
              alertClass:"alert-warning",
              alertMessage: "L'image a rencontré un problème durant l'upload.",
              alertShow: true
              });
              console.error('Problème dans le retour de l\'API/setCarteEtudiante.');
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({
              alertClass:"alert-warning",
              alertMessage: "La requête/le serveur a rencontré un problème.",
              alertShow: true
            });
          });
        }

      /**
       * Change la valeur de l'état StudentCard en fonction du fichier sélectionné
       * @param {event} event Fichier sélectionné
       */
      inputChangeStudentCard(event){
        let files = event.target.files;
        let reader = new FileReader();
        if(files[0]!=null){
          reader.readAsDataURL(files[0]);
          reader.onload=(e)=>{
            this.setState({
              StudentCard:files[0]
            })
          }
        }else{
          this.setState({
            StudentCard:null
          })
        }
      }

      /**
       * Propose une ville française selon la valeur du champs ville et mise à
       * jour de ses coordonnées grâce à l'API Adresse du gouvernement
       * @param {event} event Ajout/Suppression d'un caractère dans le champ ville
       */
      inputChangeVille(event){
        event.preventDefault();
        this.setState({
          ville: event.target.value
        })
        if(event.target.value!==""){
          const axios = require('axios').default;
          const url = "https://api-adresse.data.gouv.fr/search/?q="+event.target.value+"&type=municipality&autocomplete=1"
          axios.get(url)
          .then(res => {
            if(res.data!==null){
              if(res.data.features[0]!=null){
                this.setState({
                name: res.data.features[0].properties.city,
                lat: res.data.features[0].geometry.coordinates[1],
                long: res.data.features[0].geometry.coordinates[0],
                context: res.data.features[0].properties.context
                })
              }
            }
          })
          .catch(err => {
            console.log(err);
            //Affichage en jaune qu'il y a une erreur dans la requête
            this.setState({alertShow:true,alertMessage:"Une erreur s'est produite.",alertVariant:"warning"});
          });
        }
      }

      /**
       * Mettre de lier l'écriture dans les champs aux valeurs correspondantes 
       * dans l'état du composant
       * @param {event} event Ajout/Suppression d'un caractère dans un champs 
       */
      inputChangePassword(event) {
        event.preventDefault();
        /* Mise à jour des valeurs des inputs */
        this.setState({
          password: event.target.value
        })
        if(event.target.value.length>5){
          this.verifStrength(event.target.value);
        }else{
          this.setState({
            comptStrenghMdp:1
          });
        }
      }

      /**
       * Mettre de lier l'écriture dans les champs aux valeurs correspondantes 
       * dans l'état du composant
       * @param {event} event Ajout/Suppression d'un caractère dans un champs 
       */
      inputChange(event) {
        event.preventDefault();
        /* Mise à jour des valeurs des inputs */
        const { name, value } = event.target;
        this.setState({
          [name]: value
        })
      }

    /**
     * Rendu du component
     */
    render(){
      return(
        <div className="text-black">
          {this.state.alertShow &&
            <div className={"alert alert-dismissible fade show " + this.state.alertClass} >
              {this.state.alertMessage}
            </div>
          }
          {this.state.etape===0  && //Etape initiale du composant
            <form onSubmit={event => this.sendAccount(event)}>
            {/* 1er Formulaire d'enregistrement du compte' */}
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg">
                    {/* Input nom */}
                    <label htmlFor="nom">Nom :</label>
                    <br/>
                    <input className="input align-input"
                      id="nom"
                      name="nom"
                      type="text"
                      placeholder="Ton Nom"
                      value={this.state.nom}
                      onChange={event => this.inputChange(event)} 
                    />
                  </div>
                  <div className="col-lg">
                    {/* Input prenom */}
                    <label htmlFor="prenom">Prénom :</label>
                    <br/>
                    <input className="input align-input"
                      id="prenom"
                      name="prenom"
                      type="text"
                      placeholder="Ton prénom"
                      value={this.state.prenom}
                      onChange={event => this.inputChange(event)} 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg">

                  </div>
                  <div className="col-lg">
                    {/* Input ville */}
                    <label htmlFor="ville">Ville :</label>
                    {/* Information sur la ville trouvée si le champs n'est pas vide */}
                    {this.state.name!=="" &&
                      <label htmlFor="ville">
                        {this.state.name+" - "+this.state.context}
                      </label>
                    }
                  </div>
                  <div className="col-lg">
                    
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg">

                  </div>
                  <div className="col-lg">
                    <input className="input align-input"
                      id="ville"
                      name="ville"
                      type="text"
                      placeholder="Ta ville"
                      value={this.state.ville}
                      onChange={event => this.inputChangeVille(event)} 
                    />
                  </div>
                  <div className="col-lg">
                    
                  </div>
                </div>


                <div className="row">
                  <div className="col-lg">
                    {/* Input dateBirth */}
                    <label htmlFor="dateBirth">Date de naissance :</label>
                    <br/>
                    <input className="input align-input"
                      id="dateBirth"
                      name="dateBirth"
                      type="date"
                      maxLength="10"
                      placeholder="jj/mm/aaaa"
                      min="1960-01-01"
                      max={this.fifteenYearsAgo()}
                      value={this.state.dateBirth}
                      onChange={event => this.inputChange(event)} 
                    />
                  </div>
                  <div className="col-lg">
                    {/* Input email */}
                    <label htmlFor="email">E-mail :</label>
                    <br/>
                    <input className="input align-input"
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Ton adresse e-mail"
                      value={this.state.email}
                      onChange={event => this.inputChange(event)} 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg">
                    {/* Input password */}
                    <label htmlFor="password">Mot de passe :</label>
                    <br/>
                    <input className="input align-input"
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Ton mot de passe"
                      value={this.state.password}
                      onChange={event => this.inputChangePassword(event)} 
                    />
                    <br/>
                    <div className=" align-powermp" style={{display:"flex"}}>
                      <div style={{width:"40px",height:"10px",borderTopLeftRadius:"30px",borderBottomLeftRadius:"30px",background:"linear-gradient(to right,#FF3737, #FFAD37)"}}></div>
                      <div style={{width:"40px",height:"10px",background:(this.state.comptStrenghMdp>1?"linear-gradient(to right,#FFAD37, #54FF48)":"#C7C3BD")}}></div>
                      <div style={{width:"40px",height:"10px",background:(this.state.comptStrenghMdp>2?"linear-gradient(to right,#54FF48,#48BCFF)":"#C7C3BD")}}></div>
                      <div style={{width:"40px",height:"10px",background:(this.state.comptStrenghMdp>3?"linear-gradient(to right,#48BCFF,#4872FF)":"#C7C3BD"),borderTopRightRadius:"30px",borderBottomRightRadius:"30px"}}></div>
                    </div>
                  </div>
                  <div className="col-lg">
                    {/* Input verifPassword */}
                    <label htmlFor="verifPassword">Vérifie ton mot de passe :</label>
                    <br/>
                    <input className="input align-input"
                      id="verifPassword"
                      name="verifPassword"
                      type="password"
                      placeholder="Ton mot de passe"
                      value={this.state.verifPassword}
                      onChange={event => this.inputChange(event)} 
                    />
                  </div>
                </div>                
              </div>
              
              <br/>
              {/* Bouton Submit 1 */}
              <button className=" btn-login" type="submit">S'enregister</button>
            </form>
          }
          {this.state.etape===1  && //Etape création identifiant terminée
            <form onSubmit={event => this.sendCard(event)}>
            {/* 2nd Formulaire pour upload la carte étudiante */}
              <h4>Envoi de la carte étudiante</h4>
              <p color="grey">Votre carte étudiante dois être au format .png/.jpg/.jpeg 
              et ne doit pas dépasser 2Mo.</p>
              {/* Input StudentCard */}
              <label htmlFor="Student_Card">Carte étudiante :</label>
              <div className="input-group">
                <div className="custom-file">
                  <input type="file" className="custom-file-input" name="StudentCard" id="Student_Card" onChange={event => this.inputChangeStudentCard(event)} />
                  <label className="custom_file_label" for="Student_Card">Choisir une photo</label>
                </div>
              </div>
              <br/>
              {/* Bouton Submit 2 */}
              <button className="btn-simple">Upload</button>
            </form>
          }
          {this.state.etape===2 && //Etape carte étudiante terminée
            <div>
              <h4 className="text-blue">Ton compte viens d'être créé</h4>
              <p className="text-blue">Je t'invite à aller vite te connecter pour profiter de notre application :)</p>
            </div>
          }
        </div>
      );
    }
}

export default Register;

