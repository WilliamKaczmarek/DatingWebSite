import React, { Component } from 'react';
import RangeSlider from './Slider';
import EditProfilesPhoto from '../PhotosProfil/EditProfilePhoto';
import {URL_API} from '../App';
import Cookies from 'js-cookie';
import { Redirect } from "react-router-dom";
import {Modal,Button} from 'react-bootstrap';

/**
 * Class qui permet de gerer les informations
 * relative au compte de l'utilisateur
 */
class Preference extends Component{
    constructor(props) {
        super(props);

        //Prochaine étape : pré-sélectionner les valeurs déjà renseignées 
        //Simulation retour de la requête avec une constante(tableau je pense)
        //On peut mettre dans les select value={this.state} ce qui permet de 
        //initialiser aux valeurs de la BDD

        this.state = {
          JeSuis : "", //Sexe
          JeCherche : "", //souhaite voir
          But : 0, //ce que je cherche
          TrancheAge : [0,0], //Tranche D'âge
          Description : "", //A propos de vous         
          Ville : "", //Ville 
          Latitude:"", Longitude:"", Contexte:"", NomVille:"",
          Etudes: "", //Etudes
          Taille : 100, //Taille
          Yeux: "0", //Couleur des Yeux
          Cheveux: "",//Couleur des Cheveux
          Sport: "",//Activités Physique 
          Alcool: "", //Alcool
          Tabac: "",//Fumeur
          Animaux: "",// Animaux de compagnie 
          Religion: "",//Croyance
          Astro: "",// Signe Astrologique
          init:0,
          certif:"",
          mail:"",
          errorPass:"",OldMDP:"",NewMDP:"",NewMDPVerif:"",
          connect:true,
          StudentCard:null,alertShow:false, alertMessage:"", alertClass:"alert-danger", //Affichage, type et définition du message de l'alert
          showModal:false, modalBody:"",//Messages et affichage du le modal
          redirectPage:false
        };
      this.handleChangeLookingFor = this.handleChangeLookingFor.bind(this);
      this.handleChangeSexe = this.handleChangeSexe.bind(this);
      }

      componentDidMount(){
        this.initPref();
      }

      initPref(){
        const axios = require('axios');  //Requêtes HTTP
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        const url = URL_API+'getPreferenceValues.php?img=yes';
          axios.get(url,config)
          .then(res => {
            const tabCoor = res.data.tabPref.gps.split(';');
            const tabAge = res.data.tabPref.trancheAge.split('-');
            this.setState({
                connect : res.data.connect,
                JeSuis : res.data.tabPref.jeSuis,
                JeCherche : res.data.tabPref.jeCherche, 
                But : res.data.tabPref.butRencontre, 
                TrancheAge : [parseInt(tabAge[0],10),parseInt(tabAge[1],10)], 
                Description : res.data.tabPref.bio,       
                Ville : res.data.tabPref.ville,
                Latitude:tabCoor[0], Longitude:tabCoor[1],
                Etudes: res.data.tabPref.etude, 
                Taille : res.data.tabPref.taille, 
                Yeux: res.data.tabPref.yeux, 
                Cheveux: res.data.tabPref.cheveux,
                Sport: res.data.tabPref.sport,
                Alcool: res.data.tabPref.alcool,
                Tabac: res.data.tabPref.tabac,
                Animaux: res.data.tabPref.animaux,
                Religion: res.data.tabPref.religion,
                Astro: res.data.tabPref.astro,
                init:1,
                certif:res.data.certif,
                mail:res.data.mail
            });
          })
          .catch(err => {
            console.log(err);
          });
      }

      closeModal(){
        this.setState({
            showModal:false
        });
      }

      closeModalRedirect(){
        this.setState({
          redirectPage:true
        });
      }

      changePassword(){
        if(this.state.NewMDP===this.state.NewMDPVerif){
          const axios = require('axios');  //Requêtes HTTP
          const sha256 = require('hash-anything').sha256; //Hash du mdp
          let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
          }
          let formData = new FormData();
          formData.append('OldMDP',sha256(this.state.OldMDP));
          formData.append('NewMDP',sha256(this.state.NewMDP));
          const url = URL_API+'setPassword.php';
          axios.post(url,formData,config)
          .then(res => {
            if(res.data.connected){
              this.setState({
                errorPass:res.data.Message
              });
            }
          })
          .catch(err => {
            console.log(err);
          });

        }else{
          this.setState({
            errorPass:"Les deux nouveaux mots de passe ne correspondent pas."
          });
        }
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
       * Envoie de la valeur du champ file au serveur pour faire vérifier
       * la carte étudiante par les modérateurs
       * @param {event} event Action du 2nd form par le bouton Submit
       */
      sendCard(event){
        event.preventDefault();
        const axios = require('axios');  //Requêtes HTTP
        
        let formData = new FormData();
        formData.append('file',this.state.StudentCard);
        let config = {
          headers: {
          logginid: Cookies.get("ID"),
          logginkey: Cookies.get("KEY")
          }
      }
        const url = URL_API+'setCarteEtudiante.php';
          axios.post(url,formData,config)
          .then(res => {
            if(res.data>=0){
              switch(res.data){
                case 0:
                  this.setState({
                    alertMessage: "Aucune carte étudiante n'a été envoyée.",
                    alertClass:"alert-secondary",
                    alertShow: true
                  });
                  break;
                case 1:
                  this.setState({
                    alertClass:"alert-primary",
                    alertMessage: "Carte étudiante envoyée avec succès !",
                    certif:"jpg"
                  });
                  break;
                case 2:
                  this.setState({
                    alertClass:"alert-danger",
                    alertMessage: "Votre image dépasse 2Mo !",
                    alertShow: true
                  });
                  break;
                case 3:
                  this.setState({
                    alertClass:"alert-danger",
                    alertMessage: "L'extension de votre image n'est pas acceptée !",
                    alertShow: true
                  });
                  break;
                default:
                  this.setState({alertMessage: "La réponse de l'API n'est pas celle attendue.",alertShow: true});
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
       * Envoie les données du 1er formulaire avec les coordonnées de la ville
       * au serveur pour pouvoir creer un compte
       * @param {event} event Action du 1er form par le bouton Submit
       */
      sendPref(event) {
        event.preventDefault();
        const axios = require('axios');  //Requêtes HTTP
        let config = {
          headers: {
          logginid: Cookies.get("ID"),
          logginkey: Cookies.get("KEY")
          }
      }
        let formData = new FormData();
        formData.append('jeSuis',this.state.JeSuis);
        formData.append('jeCherche',this.state.JeCherche);
        formData.append('But',this.state.But);
        formData.append('TrancheAge',this.state.TrancheAge[0]+"-"+this.state.TrancheAge[1]);
        formData.append('Description',this.state.Description);
        formData.append('Ville',(this.state.NomVille===""?this.state.Ville:this.state.NomVille));
        formData.append('Coor',this.state.Latitude+";"+this.state.Longitude);
        formData.append('Etudes',this.state.Etudes);
        formData.append('Taille',this.state.Taille);
        formData.append('Yeux',this.state.Yeux);
        formData.append('Cheveux',this.state.Cheveux);
        formData.append('Sport',this.state.Sport);
        formData.append('Alcool',this.state.Alcool);
        formData.append('Tabac',this.state.Tabac);
        formData.append('Animaux',this.state.Animaux);
        formData.append('Religion',this.state.Religion);
        formData.append('Astro',this.state.Astro);
        const url = URL_API+'setPreference.php';
        axios.post(url,formData,config)
        .then(res => {
          if(res.data.status!=="failure"){
            this.setState({
              connect : res.data.connect
            });
            this.setState({
              showModal:true,
              modalBody:"Ton profil a été sauvegardé avec succès !"
            });
          }else{
            this.setState({
              showModal:true,
              modalBody:"Une erreur s'est produite lors de la sauvegarde de ton profil."
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      }


      onSliderAgeChange = (newValue) => {
        this.setState({
          TrancheAge : newValue
        })
      };

      /**
       * Propose une ville française selon la valeur du champs ville et mise à
       * jour de ses coordonnées grâce à l'API Adresse du gouvernement
       * @param {event} event Ajout/Suppression d'un caractère dans le champ ville
       */
      inputChangeVille(event){
        event.preventDefault();
        this.setState({
          Ville: event.target.value
        })
        if(event.target.value!==""){
          const axios = require('axios').default;
          const url = "https://api-adresse.data.gouv.fr/search/?q="+event.target.value+"&type=municipality&autocomplete=1"
          axios.get(url)
          .then(res => {
            if(res.data!==null){
              if(res.data.features[0]!=null){
                this.setState({
                NomVille: res.data.features[0].properties.city,
                Latitude: res.data.features[0].geometry.coordinates[1],
                Longitude: res.data.features[0].geometry.coordinates[0],
                Contexte: res.data.features[0].properties.context
                })
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
        }
      }
    /**
       * Met à jour la valeur du form dans lequel l'utilisateur écrit
       * @param {event} event Changement de la valeur d'un champ texte
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
       * Met à jour la valeur du radio input dans lequel l'utilisateur rentre le sexe des profils qui souhaite rencontrer
       * @param {event} event clique sur un radio bouton
       */
      handleChangeLookingFor(event) {
        this.setState({
          JeCherche: event.target.value
        });
      }

      /**
       * Met à jour la valeur du radio input dans lequel l'utilisateur rentre son sexe 
       * @param {event} event clique sur un radio bouton

       */

      handleChangeSexe(event) {
        this.setState({
          JeSuis: event.target.value
        });
      }
 /**
     * Rendu du component
     */
    render(){
      /* Utilisateur redirigé si non connecté */
      if(!this.state.connect){
          Cookies.remove("ID");//Supression du cookie
          Cookies.remove("KEY");//Suppression du cookie
          return (<Redirect to='/'/>); //Renvoi à la page de connexion
      }else if(this.state.redirectPage){
        return (<Redirect to='/principale'/>);
      }
      return(
        <div className="margetop18 padbot5" >
          <Modal show={this.state.showModal} onHide={()=> this.closeModal()}>
            <Modal.Header closeButton>
              <Modal.Title>Sauvegarde de ton profil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.modalBody}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=> this.closeModalRedirect()}>
                Page principale
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Formulaire du profil de la personne' */}
          {this.state.init===1?
          <div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg">
                  <div className="input_group_prepend">
                    <label className="input_group_text"><i className="far fa-envelope"></i>Votre mail : {this.state.mail}</label>
                  </div>
                  <br/>
                  <div className="row">
                    <div className="col-lg">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="OldMDP"><i className="fas fa-lock"></i>Changer de mot de passe :<br/>{this.state.errorPass}</label>
                      </div>
                    </div>
                    <div className="col-lg">
                      <div className="input_group">
                        <div className="input_group_prepend">
                          <label className="input_group_text" htmlFor="OldMDP">Ancien :</label>
                        </div>
                        <input
                          id="OldMDP"
                          name="OldMDP"
                          type="password"
                          value={this.state.OldMDP}
                          onChange={(event) => this.inputChange(event)}
                        />
                      </div>
                    </div>
                    <div className="col-lg">
                      <div className="input_group">
                        <div className="input_group_prepend">
                          <label className="input_group_text" htmlFor="NewMDP">Nouveau :</label>
                        </div>
                        <input
                          id="NewMDP"
                          name="NewMDP"
                          type="password"
                          value={this.state.NewMDP}
                          onChange={(event) => this.inputChange(event)} 
                        />
                      </div>
                    </div>
                    <div className="col-lg">
                      <div className="input_group">
                        <div className="input_group_prepend">
                          <label className="input_group_text" htmlFor="NewMDPVerif">Vérification :</label>
                        </div>
                        <input
                          id="NewMDPVerif"
                          name="NewMDPVerif"
                          type="password"
                          value={this.state.NewMDPVerif}
                          onChange={(event) => this.inputChange(event)}
                        />
                      </div>
                    </div>
                    <div className="col-lg">
                      <button 
                      className="btn-simple"
                      onClick={() => this.changePassword()}>
                        Changer <br/> de mot de passe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            {/*--------------------------Photos--------------------------*/}
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm">
                  <EditProfilesPhoto />
                </div>
              </div>
              
            </div>
              
            <br/>
            <form onSubmit={event => this.sendPref(event)}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg">
                  </div>
                  <div className="col-lg">
                    {this.state.certif==="1"?
                      <div>T'es certifié !</div>
                      :this.state.certif==="0"?
                        <div>Veuillez envoyer votre carte étudiante.
                          {this.state.alertShow &&
                            <div className={"alert alert-dismissible fade show " + this.state.alertClass} >
                              {this.state.alertMessage}
                            </div>
                          }
                          <div className="carte">
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
                            <button className="btn-simple" onClick={(event) => this.sendCard(event)}>Upload</button>
                          </div>
                        </div>
                        :<div>Votre carte étudiante est en attente de validation...</div>
                    }
                  </div>
                  <div className="col-lg">
                  </div>
                </div>
                <br/>

                  
                <div className="row">
                  <div className="col-lg">
                    {/*--------------------------Sexe--------------------------*/}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="sexe"><i className="fas fa-restroom"></i>Je suis :</label>
                      </div> 
                      <div className="form-check form-check-inline">
                        <label className="form-check-label" htmlFor="Male">Un homme</label>
                        <input 
                          className="form-check-input"
                          type="radio"
                          name="JeSuis"
                          id="Male"
                          value="Homme"
                          checked={this.state.JeSuis==="Homme"}
                          onChange={this.handleChangeSexe}


                        />
                      </div>
                      <div className="form-check form-check-inline">
                        <label className="form-check-label" htmlFor="Female">Une femme</label>
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="JeSuis" 
                          id="Female"
                          value="Femme"
                          checked={this.state.JeSuis==="Femme"}
                          onChange={this.handleChangeSexe}


                        />
                      </div>
                      <div className="form-check form-check-inline">
                        <label className="form-check-label" htmlFor="Alive">Vivant</label>
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="JeSuis" 
                          id="Alive"
                          value="Vivant"
                          checked={this.state.JeSuis==="Vivant"}
                          onChange={this.handleChangeSexe}
        
                        />
                      </div>
                    </div>
                  </div>
                  
                </div><br/>

                <div className="row">
                  <div className="col-lg">
                    {/*--------------------------Souhaite voir--------------------------*/}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="lookingfor">Je souhaite rencontrer :</label>
                      </div> 
                      <div className="form-check form-check-inline">
                        <label className="form-check-label" htmlFor="Hommes">Des hommes</label>
                        <input 
                          className="form-check-input"
                          type="radio"
                          name="lookingfor"
                          id="Hommes"
                          value="Hommes"
                          checked={this.state.JeCherche==='Hommes'}
                          onChange={this.handleChangeLookingFor}
                          />
                      </div>
                      <div className="form-check form-check-inline">
                        <label className="form-check-label" htmlFor="Femmes">Des femmes</label>
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="lookingfor" 
                          id="Femmes" 
                          value="Femmes"
                          checked={this.state.JeCherche==='Femmes'}
                          onChange={this.handleChangeLookingFor}
                          />
                      </div>
                      <div className="form-check form-check-inline">
                        <label className="form-check-label" htmlFor="Les deux">Les deux</label>
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="lookingfor" 
                          id="Les deux" 
                          value="Les deux" 
                          checked={this.state.JeCherche==='Les deux'}
                          onChange={this.handleChangeLookingFor}
                        />
                      </div>
                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*--------------------------Cherche-------------------------- */}
                    <div className="input_group ">
                        <div className="input_group_prepend">
                          <label className="input_group_text" htmlFor="But">Ce que je cherche :</label>
                        </div>
                        <select  id="But" value={this.state.But} name="But" onChange={(event) => this.inputChange(event)}>
                          <option  value="0">A remplir</option>
                          <option value="1">Du sérieux</option>
                          <option value="2">Aller boire un verre</option>
                          <option value="3">On verra</option>
                          <option value="4">Pas de prise de tête</option>
                          <option value="5">Occuper ma soirée </option>
                          <option value="6">Amitié </option>
                          <option value="7">Seulement tchatter </option>
                        </select>
                      </div>
                  </div>
                  <div className="col-lg ">
                    {/*--------------------------Tranche d age-------------------------- */}
                    <RangeSlider intervalle={this.state.TrancheAge} onSliderAgeChange={this.onSliderAgeChange}/>
                  </div>
                </div>
                
                  
                <div className="row">
                  
                  
                  <div className="col-lg">
                    {/*--------------------------Description--------------------------*/}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Description"><i className="fas fa-pencil-alt"></i>A propos de vous :</label>
                      </div> 
                        <textarea
                          id="Description"
                          name="Description"
                          type="text"
                          placeholder="Vous avez 350 caractères pour nous en dire plus ;)"
                          style={{resize: "none"}}
                          rows="2"//hauteur
                          cols="50" //largeur
                          maxLength="350"
                          value={this.state.Description}
                          onChange={event => this.inputChange(event)} 
                        />
                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*-------------------------- Ville--------------------------*/}
                    {this.state.NomVille!=="" &&
                      <label>
                        {this.state.NomVille+" - "+this.state.Contexte}
                      </label>
                    }
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Ville"><i className="fas fa-home"></i>J'habite à :</label>
                      </div>                
                      <input
                          id="Ville"
                          name="Ville"
                          type="text"
                          placeholder="Paris"
                          value={this.state.Ville}
                          onChange={event => this.inputChangeVille(event)} 
                        />
                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*--------------------------Etudes-------------------------- */}
                    <div className="input_group ">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Etudes"><i className="fas fa-user-graduate"></i>J'étudie au :</label>
                      </div>
                      <select  id="Etudes" value={this.state.Etudes} name="Etudes" onChange={(event) => this.inputChange(event)}>
                        <option  value="none">A remplir</option>
                        <option value="Lycée">Lycée</option>
                        <option value="Université">Université</option>
                        <option value="Ecole d'Ingénieur">Ecole d'Ingénieur</option>
                        <option value="Ecole de commerce">Ecole de commerce</option>
                        <option value="Ecole supérieur">Ecole supérieur</option>
                        <option value="Reconversion">Reconversion </option>
                        <option value="Année sabatique">Année sabatique</option>
                      </select>
                    </div>
                  </div>
                  
                </div><br/>
               
                <div className="row">
                  
                  <div className="col-lg">
                    {/*--------------------------Taille-------------------------- */}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Taille"><i className="fas fa-ruler"></i>Je mesure :</label>
                      </div>
                          <input
                            id="Taille"
                            name="Taille"
                            type="number"
                            min="100"
                            max="300"
                            value={this.state.Taille}
                            onChange={event => this.inputChange(event)}
                          />
                          <label className="input_cm" htmlFor="Taille">cm</label>
                          

                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*--------------------------Yeux-------------------------- */}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Yeux"><i className="far fa-eye"></i>Mes yeux sont :</label>
                      </div>
                      <select  id="Yeux" value={this.state.Yeux} name="Yeux" onChange={(event) => this.inputChange(event)}>
                        <option  value="none">A remplir</option>
                        <option value="Noir">Noir</option>
                        <option value="Marron">Marron</option>
                        <option value="Vert">Vert</option>
                        <option value="Bleu">Bleu</option>
                        <option value="Verron">Verron</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*--------------------------Cheveux-------------------------- */}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Cheveux"><i className="fas fa-cut"></i>Mes cheveux sont :</label>
                      </div>
                      <select  id="Cheveux" value={this.state.Cheveux} name="Cheveux" onChange={(event) => this.inputChange(event)}>
                      <option  value="none">A remplir</option>
                        <option value="Noir">Noir</option>
                        <option value="Brun">Brun</option>
                        <option value="Auburn">Auburn</option>
                        <option value="Châtain">Châtain</option>
                        <option value="Roux">Roux</option>
                        <option value="Blond">Blond</option>
                        <option value="Blanc">Blanc</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </div><br/>
                

                <div className="row">
                  
                  
                  <div className="col-lg">
                    {/*--------------------------Sport-------------------------- */}
                    <div className="input_group ">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Sport"><i className="fas fa-dumbbell"></i>Les activités physique :</label>
                      </div>
                      <select  id="Sport" value={this.state.Sport} name="Sport" onChange={(event) => this.inputChange(event)}>
                        <option  value="none">A remplir</option>
                        <option value="Passioné">Passioné(e)</option>
                        <option value="Régulièrement">Régulièrement</option>
                        <option value="Parfois">Parfois</option>
                        <option value="Une fois au chalet">Une fois au chalet</option>
                        <option value="Quelle horreur">Quelle horreur</option>
                      </select>
                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*--------------------------Alcool-------------------------- */}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Alcool"><i className="fas fa-cocktail"></i>L'alcool :</label>
                      </div>
                      <select  id="Alcool" value={this.state.Alcool} name="Alcool" onChange={(event) => this.inputChange(event)}>
                        <option  value="none">A remplir</option>
                        <option value="Tous les jours">Tous les jours</option>
                        <option value="Régulièrement">Régulièrement</option>
                        <option value="A l'occasion">A l'occasion</option>
                        <option value="Jamais">Jamais</option>
                      </select>
                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*--------------------------Tabac-------------------------- */}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Tabac"><i className="fas fa-smoking"></i>Le tabac :</label>
                      </div>
                      <select  id="Tabac" value={this.state.Tabac} name="Tabac" onChange={(event) => this.inputChange(event)}>
                        <option  value="none">A remplir</option>
                        <option value="Fréquemment">Fréquemment</option>
                        <option value="A l'occasion">A l'occasion</option>
                        <option value="Jamais">Jamais</option>
                      </select>
                    </div>
                  </div>
                  
                </div><br/>
               

                <div className="row">
                  
                  <div className="col-lg">
                    {/*--------------------------Animaux Domestique-------------------------- */}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Animaux"><i className="fas fa-paw"></i>Mes animaux de compagnie :</label>
                      </div>
                      <select  id="Animaux" value={this.state.Animaux} name="Animaux" onChange={(event) => this.inputChange(event)}>
                        <option  value="none">A remplir</option>
                        <option value="Chiens">Chiens</option>
                        <option value="Chats">Chats</option>
                        <option value="Beaucoup">Beaucoup :)</option>
                        <option value="Autres">Autres</option>
                        <option value="Aucun">Aucun</option>
                        <option value="Allergique">Allergique :'(</option>
                      </select>
                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*--------------------------Religion-------------------------- */}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Religion"><i className="fas fa-church"></i>Ma religion :</label>
                      </div>
                      <select  id="Religion" value={this.state.Religion} name="Religion" onChange={(event) => this.inputChange(event)}>
                        <option  value="none">A remplir</option>
                        <option value="Agnosticisme">Agnosticisme</option>
                        <option value="Athéisme">Athéisme</option>
                        <option value="Bouddhisme">Bouddhisme</option>
                        <option value="Christianisme">Christianisme</option>
                        <option value="Hindouisme">Hindouisme</option>
                        <option value="Jaïnisme">Jaïnisme</option>
                        <option value="Judaïsme">Judaïsme</option>
                        <option value="Islam">Islam</option>
                        <option value="Zoroastrisme">Zoroastrisme</option>
                        <option value="Sikhisme">Sikhisme</option>
                        <option value="Spiritualité">Spiritualité</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    <br/>
                  </div>
                  <div className="col-lg">
                    {/*--------------------------Signe Astro-------------------------- */}
                    <div className="input_group">
                      <div className="input_group_prepend">
                        <label className="input_group_text" htmlFor="Astro"><i className="far fa-star"></i>Mon signe astrologique :</label>
                      </div>
                      <select  id="Astro" value={this.state.Astro} name="Astro" onChange={(event) => this.inputChange(event)}>
                        <option  value="none">A remplir</option>
                        <option value="Verseau">Verseau</option>
                        <option value="Poissons">Poissons</option>
                        <option value="Bélier">Bélier</option>
                        <option value="Taureau">Taureau</option>
                        <option value="Gémeaux">Gémeaux</option>
                        <option value="Cancer">Cancer</option>
                        <option value="Lion">Lion</option>
                        <option value="Vierge">Vierge</option>
                        <option value="Scorpion">Scorpion</option>
                        <option value="Sagittaire">Sagittaire</option>
                        <option value="Capricorne">Capricorne</option>
                        <option value="Balance">Balance</option>
                      </select>
                    </div>
                  </div>
                </div><br/>
                

                <div className="row">
                  
                  
                </div><br/>
                
              </div>

                {/*--------------------------SAVE-------------------------- */}
              <button className="btn-login" type="submit">Sauvegarder</button>
            </form>
          </div>
              :
              <div>Chargement...</div>
              }
        </div>
          );
    }
}

export default Preference;
