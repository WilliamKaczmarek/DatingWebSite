import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Cookies from 'js-cookie';
import { Redirect } from "react-router-dom";

import {URL_API} from '../App';

/**
 * Class pour le formulaire de connexion dans la page de connexion
 */
class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
          alertShow: false, alertMessage : "", alertVariant:"",//Affichage, message et type de l'alerte
          email: "", password : "", //Input mail et password
          connected : false
        };
      }

      /**
       * Compare les identifiants avec la base de donnée
       * Si les identifiants existent et sont bon, l'utilisateur est connecté
       * @param {event} event Action du form par le bouton Submit
       */
      sendLogin(event) {
        event.preventDefault();
        const axios = require('axios').default;  //Requêtes HTTP
        const sha256 = require('hash-anything').sha256; //Hash du mdp
        const url = URL_API+'getPrenom.php?mail='+this.state.email.toLowerCase()+'&password='+sha256(this.state.password);
        axios.get(url)
        .then(res => {
          if(res.data.id>0){
            //Se connecter
            Cookies.set("ID",res.data.id);
            Cookies.set("KEY",res.data.key);
            this.setState({
              connected:true
            });
          }else{
            //Affichage en rouge du message de mdp incorrect
            this.setState({alertShow:true,alertMessage:"Adresse mail ou mot de passe incorrect.",alertVariant:"danger"});
          }
        })
        .catch(err => {
          console.log(err);
          //Affichage en jaune qu'il y a une erreur dans la requête
          this.setState({alertShow:true,alertMessage:"Une erreur s'est produite.",alertVariant:"warning"});
        });
      }
     
      /**
       * Met à jour la valeur du form dans lequel l'utilisateur écrit
       * @param {event} event Changement de la valeur d'un input
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
        /* Utilisateur redirigé si connecté */
        if(this.state.connected){
          return(<Redirect to='/principale'/>); //Redirection vers la page principale
        }
      return(
        <div>
          {/* Alert affichée lorsque le couple (e-mail,mdp) n'est pas trouvé dans la base de donnée */}
          <Alert
          variant={this.state.alertVariant} 
          id="AlertIncorrect" 
          show={this.state.alertShow} 
          onClose={() => this.setState({alertShow:false})}
          dismissible>
            {this.state.alertMessage}
          </Alert>

          {/* Formulaire de connexion */}
          <div className="container-fluid">
            <form onSubmit={event => this.sendLogin(event)}>
              <div className="row">

                <div className="col-lg margetop5">
                  <input className="input align-input"
                    name="email"
                    type="text"
                    placeholder="Ton adresse e-mail"
                    value={this.state.email}
                    onChange={event => this.inputChange(event)} 
                  />
                </div>


                <div className="col-lg margetop5">
                   <input className="input align-input"
                      name="password"
                      type="password"
                      placeholder="Ton mot de passe"
                      value={this.state.password}
                      onChange={event => this.inputChange(event)} 
                    />
                </div>

              </div>
              <br/>
              <button className="btn-login" type="submit">Connexion</button>
            </form>
            <br/>
          </div>
        </div>
      );
    }
}

export default Login;