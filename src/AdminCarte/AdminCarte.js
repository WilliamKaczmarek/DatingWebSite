import React, { Component } from 'react';
import TableauCarteId from './TableauCarteId';
import {URL_API} from '../App';
import Cookies from 'js-cookie';
import TableauManage from './TableauManage';
import { Redirect } from "react-router-dom";

/**
 * Class qui s'occupe de la page du panel administrateur
 */
class AdminCarte extends Component{
    constructor(props) {
      super(props);

      this.state = {
        allowed:true,
        loaded:false,
        array:null,
        buttonLabel:"Gérer les comptes"
      };
    }

    /**
     * Component initialisé
     */
    componentDidMount(){
      this.setPropsTableau();
    }

    /**
     * Fonction qui met à jour le tableau proposé
     * Cette fonction sera passé en Props pour permettre aux components enfant d'acceder au this.state.array
     * @param {Tab of Objects} newArray Tableau renvoyé par l'API contenant les informations des comptes 
     */
    updateTab = (newArray) => {
      this.setState({
        array: newArray
      });
    }

    /**
     * Met à jour un état qui renverra l'utilisateur à une autre pas si il n'est pas connecté
     * ou s'il n'a pas le grade administrateur
     */
    verifPermission(){
      const axios = require('axios');  //Requêtes HTTP
      const url = URL_API+'isConnected.php';
      let config = {
          headers: {
          logginid: Cookies.get("ID"),
          logginkey: Cookies.get("KEY")
          }
      }
      axios.get(url,config)
      .then(res => {
          if(!(res.data.connect && res.data.grade==="administrateur")){ //Mise à jour de connected si réponse positive 
            this.setState({allowed:false});
          }
      })
      .catch(err => {
          console.log(err);
      });
    }

    /**
     * Initialise le tableau des comptes proposés
     * Initialisation pour la gestion des cartes
     */
    setPropsTableau(){
      const axios = require('axios');  //Requêtes HTTP
      const url = URL_API+'getTabCarteEtudiante.php';
      let config = {
          headers: {
          logginid: Cookies.get("ID"),
          logginkey: Cookies.get("KEY")
          }
      }
      axios.get(url,config)
      .then(res => {
          if(res.data.connected){ //Mise à jour de connected si réponse positive 
            this.setState({
              array:res.data.tab,
              loaded:true
            });       
            this.verifPermission();
          }
      })
      .catch(err => {
          console.log(err);
      });
    }

    /**
     * Met à jour le tableau pour la gestion des comptes
     */
    setComtpeTableau(){
      const axios = require('axios');  //Requêtes HTTP
      const url = URL_API+'getTabCarteEtudiante.php?account=yes';
      let config = {
          headers: {
          logginid: Cookies.get("ID"),
          logginkey: Cookies.get("KEY")
          }
      }
      axios.get(url,config)
      .then(res => {
          if(res.data.connected){ //Mise à jour de connected si réponse positive 
            this.setState({
              array:res.data.tab,
              loaded:true
            });
          }
      })
      .catch(err => {
          console.log(err);
      });
    }

    /**
     * Mise à jour des tableaux selon si l'on veut gérer les cartes étudiantes 
     * ou s'il on veut gérer les comptes 
     */
    buttonSwap(){
      if(this.state.buttonLabel==="Gérer les comptes"){
        this.setState({
          buttonLabel: "Gérer les certifications"
        });
        this.setComtpeTableau();
      }else{
        this.setState({
          buttonLabel: "Gérer les comptes"
        });
        this.setPropsTableau();
      }
    }

    /**
     * Rendu du component
     */
    render(){
      if(!this.state.allowed){
        return(<Redirect to='/principale'/>);//si l'utilisateur n'as pas la permission il est renvoyé à la page principale
      }
      return(
        <div style={{marginTop:"20px"}}>
          <h1>Panel administrateur</h1>
          <button onClick={() => this.buttonSwap()} style={{height:"70px",width:"200px"}}>{this.state.buttonLabel}</button>
          {(this.state.loaded && this.state.buttonLabel==="Gérer les comptes") &&
          <TableauCarteId Tableau={this.state.array} updateTab={this.updateTab}/>
          }
          {(this.state.loaded && this.state.buttonLabel==="Gérer les certifications") && 
          <TableauManage Tableau={this.state.array} updateTab={this.updateTab}/>
          }
        </div>
      );
    }
}

export default AdminCarte;