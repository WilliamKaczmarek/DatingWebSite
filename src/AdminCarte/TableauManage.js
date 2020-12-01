import React, { Component } from 'react';
import {URL_API} from '../App';
import Cookies from 'js-cookie';


/**
 * Class qui s'occupe de la gestion des comptes dans la page du panel administrateur
 */
class TableauManage extends Component{
    constructor(props) {
      super(props);

      this.state = {
          tabID: this.props.Tableau,
          Actuel:{Prenom:"",Nom:"",Id:""},
          ActuelPerso:{Mail:"",DateNaissance:"",Grade:"",DateCrea:""}
      };
    }

    /**
     * Ré-actualise le tableau contenant les différents comptes
     * Utilisé lorsqu'on supprime un compte
     */
    reset(){
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
                console.log(res.data.tab);
                this.props.updateTab(res.data.tab);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    /**
     * Fonction qui actualise l'utilisateur courant sélectionné
     * @param {Object} el objet contenant prenom, nom, ID, email, date de naissance,
     * grade et date de création de compte d'un utilisateur
     */
    alertId(el){
        this.setState({
            Actuel:{
                Prenom:el.Prenom,
                Nom:el.Nom,
                Id:el.Id
            },
            ActuelPerso:{
                Mail:el.Mail,
                DateNaissance:el.DateNaissance,
                Grade:el.Grade,
                DateCrea:el.DateCrea
            }
        });
    }

    /**
     * Transformation du tableau d'objet en un tableau html avec le nom, prenom et ID de l'utilisateur
     */
    PropsToTabHTML(){
    let res;
    if(this.props.Tableau!=null && this.props.Tableau.length>0){
        res = this.props.Tableau.map(el => <tr key={el.Id}><td>{el.Prenom}</td><td>{el.Nom}</td><td><button onClick={() => this.alertId(el)}>{el.Id}</button></td></tr>);
        return res;
    }else{
        return(<tr><td colSpan="3">Plus de carte à valider</td></tr>)
    }
    }

    /**
     * Supprime le compte de l'utilisateur sélectionné,
     * ainsi que ses photos, carte étudiante et ses matchs
     */
    deleteAccount(){
        const axios = require('axios');  //Requêtes HTTP
        const url = URL_API+'manageAccount.php';
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        let formData = new FormData();
        formData.append('id',this.state.Actuel.Id);
        formData.append('supprCompte',"yes");
        axios.post(url,formData,config)
        .then(res => {
            if(res.data.connected){
                console.log(res.data);
                alert("Compte "+this.state.Actuel.Id+" supprimé !");
                this.reset();
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    /**
     * Certifie l'utilisateur en supprimant sa carte étudiante si 
     * il en avait une
     */
    certificate(){
        const axios = require('axios');  //Requêtes HTTP
        const url = URL_API+'manageAccount.php';
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        let formData = new FormData();
        formData.append('id',this.state.Actuel.Id);
        formData.append('operation','certif');
        axios.post(url,formData,config)
        .then(res => {
            if(res.data.connected){
                console.log(res.data);
                console.log("Compte "+this.state.Actuel.Id+" certifié !");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    /**
     * Fonction qui met à jour le grade d'un utilisateur, 
     * rétrogradation ou promotion
     * @param {action} action 
     */
    rank(action){
        const axios = require('axios');  //Requêtes HTTP
        const url = URL_API+'manageAccount.php';
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        let formData = new FormData();
        formData.append('id',this.state.Actuel.Id);
        formData.append('rank',action);
        axios.post(url,formData,config)
        .then(res => {
            if(res.data.connected){

                this.reset();
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    /**
     * Fonction genéral de gestion d'un compte mais pour l'instant c'est
     * pour réinitialiser le nombre de like quotidien d'un compte
     */
    management(action){
        const axios = require('axios');  //Requêtes HTTP
        const url = URL_API+'manageAccount.php';
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        let formData = new FormData();
        formData.append('id',this.state.Actuel.Id);
        formData.append('action',action);
        axios.post(url,formData,config)
        .then(res => {
            if(res.data.connected){
                this.reset();
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    /**
     * Rendu du component
     */
    render(){
      return(
        <div style={{marginTop:"20px"}}>
            <h2>Gestion des comptes</h2>
            <div style={{display:"flex",justifyContent:"center",marginTop:"3%"}}>
                <div>
                    <table style={{border:"thin solid black"}}>
                        <thead>
                            <tr>
                                <th>Prénom</th>
                                <th>Nom</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.PropsToTabHTML()}
                        </tbody>
                    </table>
                </div>
                {this.state.Actuel.Prenom!=="" &&
                <div style={{margin:"50px"}}>
                <ul>
                    <li>{"Adresse email : "+this.state.ActuelPerso.Mail}</li>
                    <li>{"Date de naissance : "+this.state.ActuelPerso.DateNaissance}</li>
                    <li>{"Grade : " + this.state.ActuelPerso.Grade}</li>
                    <li>{"Date de création : " + this.state.ActuelPerso.DateCrea}</li>
                </ul>
                {this.state.ActuelPerso.Grade==="nouveau" &&
                    <button style={{backgroundColor:"#48FF5B"}} onClick={() => this.rank("promote")}>Promouvoir</button>
                }
                {this.state.ActuelPerso.Grade==="premium" &&
                    <button style={{backgroundColor:"#FF5B48"}} onClick={() => this.rank("demote")}>Rétrograder</button>
                }
                <button style={{backgroundColor:"#48FF5B"}} onClick={() => this.management("resetLike")}>Réinitialiser les likes quotidien</button>
                <button style={{backgroundColor:"#48FF5B"}} onClick={() => this.certificate()}>Certifier</button>
                <button style={{backgroundColor:"#FF5B48"}} onClick={() => this.deleteAccount()}>Supprimer le compte</button>
                </div>
                }
            </div>
        </div>
      );
    }
}

export default TableauManage;