import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Redirect } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import {URL_API} from '../App';

import Login from './Login'
import Register from './Register'

/**
 * Class qui s'occupe de la page de connexion
 */
class Accueil extends Component{
    constructor(props) {
        super(props);

        this.state = {
            show: 0, 
            /* Correspondance show
            * 0 -> Accueil
            * 1 -> Accueil + Login
            * 2 -> Accueil + Register 
            */
           connected : false
        };
    }

    /**
     * Page initialisée
     */
    componentDidMount(){
        /* Vérif des cookies ID et KEY */
        this.verifConnexion();
    }

    /**
     * Met à jour l'état connected selon la véracité 
     * du couple (Cookie.get("ID"),Cookie.get("KEY"))
     */
    verifConnexion() {
        const url = URL_API+'isConnected.php';
        const axios = require('axios');  //Requêtes HTTP
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        axios.get(url,config)
        .then(res => {
            if(res.data.connect){ //Mise à jour de connected si réponse positive 
                this.setState({
                    connected:true
                })
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    /**
     * Changement du state.show
     * @param {number} etat : attribut la valeur etat à state.show
     */
    changeShow(etat){
        this.setState({
            show: etat
        })
    }

    /**
     * Retourne un l'affichage de la page d'accueil.
     * - Deux boutons : Connexion & Création du compte
     * - L'affichage dépend de this.state.show
     */



    render(){
        /* Utilisateur redirigé si connecté */
        if(this.state.connected){
            return <Redirect to='/principale'/> //Renvoi à la page principale
        } else {return(

             <div className="container-fluid bg-image ">
                <div className="margetop18">
                    <h1 className="text-white">RENCONTRES, DISCUSSIONS,</h1>
                    <h2 className="text-white">ET VOUS ? </h2>
                    <h2 className="text-white">QUI ALLEZ-VOUS ETUDIER ?</h2>

                    
                    {/* show = 0 -> on affiche deux bouton Login et Register */}
                    {this.state.show === 0 && 
                        <div className="container-fluid">
                            <div className="btn-group margetop18 width100">
                                <div className="col ">
                                    <button className=" btn-accueil" onClick={etat => this.changeShow(1)}>Se connecter</button>
                                </div>
                                <div className="col ">
                                    <button className=" btn-accueil" onClick={etat => this.changeShow(2)}>Se créer un compte</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                    
                    {/* show = 1 -> on affiche Login */}
                    {this.state.show === 1 && 
                        <div className="size-full padtop18 bg-transparentgrey">
                            <div className="container ">
                                <div className="row">
                                    <div className="col-2">

                                    </div>

                                    <div className="col-8 bg-brokenwhite">
                                        {/* Proposition de s'enregistrer s'il n'est pas encore dans la BDD */}
                                        <p className="text-black">Tu n'as toujours pas de compte ?&nbsp;
                                            <br/>
                                            {/* Utilisation du NavLink pour ses propriétés graphiques */}
                                            <NavLink className="text-black" to="/" onClick={etat => this.changeShow(2)}>Je cours m'en faire un !</NavLink>
                                        </p>

                                        <h2 className="text-black">Connexion</h2>

                                        <Login />
                                    </div>

                                    <div className="col-2">

                                    </div>
                                </div>                                                                                   
                            </div>
                            <div className="container ">
                                <div className="row">
                                
                                    <div className="col margecross">
                                        <button className="close" onClick={etat => this.changeShow(0)} aria-label="Close">
                                            <span className=" bg-red" aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                    <div className="col">

                                    </div>
                                </div>                                                                                   
                            </div>
                        </div>
                    }
                    {/* show = 2 -> on affiche Register */}
                    {this.state.show === 2 && 
                        <div className="size-full padtop18 bg-transparentgrey">
                            <div className="container ">
                                <div className="row">
                                    <div className="col-2">

                                    </div>

                                    <div className="col-8 bg-brokenwhite">
                                        {/* Proposition de s'enregistrer s'il n'est pas encore dans la BDD */}
                                        <h2 className="text-black">Création du compte</h2>
                                        <Register />
                                    </div>

                                    <div className="col-2">

                                    </div>
                                </div>                                                                                   
                            </div>
                            <div className="container ">
                                <div className="row">
                                
                                    <div className="col margecross">
                                        <button className="close" onClick={etat => this.changeShow(0)} aria-label="Close">
                                            <span className=" bg-red" aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                    <div className="col">

                                    </div>
                                </div>                                                                                   
                            </div>
                        </div>
                    }   
            </div>
        );
        }
    }
}

export default Accueil;






