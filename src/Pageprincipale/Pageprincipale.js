import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Redirect } from "react-router-dom";
import {URL_API} from '../App';
//import ListMatch from '../messagerie/listeMatch';
import CardId from '../CardId/CardId';
import {Card,Modal,Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Filtre from '../Profil/Filtre';
import ListMessages from '../messagerie/message'


/**
 * Class qui s'occupe de la page principale où l'utilisateur 
 * peut acceder à toutes les pages qui lui sont disponible et 
 * où l'on like/dislike des partenaires
 */
class Pageprincipale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: true, //true : utilisateur connecté; false : utilisateur non connecté
            pref:false, //Passe à true lorsque l'utilisateur clique sur preference
            tabPersonne:null,
            currentIndex:0,
            loaded:false,
            panel:false,
            grade:"",
            showFiltre:false,
            showModal:false, modalTitle:"", modalBody:"",
            showMessage : 0
        }
        this.handleChildUnmount = this.handleChildUnmount.bind(this);

      }
    handleChildUnmount(){
        this.setState({showMessage: 0});
    }
      /**
       * Ferme le modal
       */
    closeModal(){
        this.setState({
            showModal:false
        });
    }


    /**
     * 
     * @param {Tab of integer} newTab Tableau comprenant les id des personnes 
     * correspondant à la recherche de l'utilisateur 
     */
    onChangeTabPersonne = (newTab) => {
        this.setState({
            tabPersonne:newTab,
            currentIndex:0
        })
    };

    /**
     * Page mise à jour
     */
    componentDidMount(){
        /* Vérif des cookies ID et KEY */
        this.loadTableauPersonne();
        this.verifConnexion();
        if(Cookies.get('m_id1') !== undefined){this.setState({showMessage:1})}
    }

    /**
     * Creer un match entre deux utilisateur pour qu'il puisse parler ultérieurement
     * @param {integer} idAutre ID de la personne avec qui l'utilisateur a match
     */
    createMatch(idAutre){
		const axios = require('axios');  //Requêtes HTTP
		let formdata = new FormData();
		let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
		formdata.append("id2",idAutre);
        const url = URL_API+'newDisc.php';
        axios.post(url,formdata,config)
        .then(res => {
            if(res.data===1){
                this.setState({
                    currentIndex:this.state.currentIndex+1,
                    showModal:true,
                    modalTitle:"Match !",
                    modalBody:"Tu as un nouveau match ! Va vite lui parler via le chat. "
                });
              this.setState({alertShow: true});
            }else if(res.data === 2){
            	console.error("vous n'avez pas l'air d'etre connecté");
            }else{
            	console.error('Problème dans le retour de l\'API/newUser.');

            }
        })
        .catch(err => {
            console.log(err);
        });
	}

    /**
     * Indique à la base de donnée que l'utilisateur a dislike un autre
     * utilisateur
     */
    dislike(){
        const url = URL_API+'addDislike.php?id='+this.state.tabPersonne[this.state.currentIndex];
        const axios = require('axios').default;  //Requêtes HTTP
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        axios.get(url,config)
        .then(res => {
            if(res.data.connected){ //Mise à jour de connected si réponse négative
                if(res.data.dislikes!=="echec"){
                    this.setState({
                        currentIndex:this.state.currentIndex+1
                    });
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    /**
     * Indique à la base de donnée que l'utilisateur a like un autre utilisateur
     */
    like(){
        const url = URL_API+'addLike.php?id='+this.state.tabPersonne[this.state.currentIndex];
        const axios = require('axios').default;  //Requêtes HTTP
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        axios.get(url,config)
        .then(res => {
            if(res.data.connected){ //Mise à jour de connected si réponse négative
                if(res.data.likes!=="echec"){
                    if(res.data.acceptedLike){
                        if(res.data.match){
                            this.createMatch(this.state.tabPersonne[this.state.currentIndex]);
                        }else{
                            this.setState({
                                currentIndex:this.state.currentIndex+1
                            });
                        }
                    }else{
                        this.setState({
                            showModal:true,
                            modalTitle:"Nombre de like épuisé",
                            modalBody:"Tu as utilisé tes 10 likes quotidien ! Deviens un abonné pour bénéficier d'un nombre de like ilimité."
                        });
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    /**
     * Charge le tableau des personnes qui seront proposés
     */
    loadTableauPersonne(){
        const url = URL_API+'getTabPersonne.php';
        const axios = require('axios').default;  //Requêtes HTTP
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        axios.get(url,config)
        .then(res => {
            if(res.data.connected){
                this.setState({
                    tabPersonne:res.data.tab,
                    currentIndex:0,
                    loaded:true
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    /**
     * Met à jour l'état connected selon la véracité 
     * du couple (Cookie.get("ID"),Cookie.get("KEY"))
     */
    verifConnexion() {
        /* A executer à chaque fois que l'on veut utiliser l'id :
            this.verifConnexion();
            if(this.state.connected){
                alors on est assuré de l'identité du user
            }*/
        const url = URL_API+'isConnected.php';
        const axios = require('axios').default;  //Requêtes HTTP
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        axios.get(url,config)
        .then(res => {
            if(!res.data.connect){ //Mise à jour de connected si réponse négative
                this.setState({
                    connected:false,
                });
            }else{
                this.setState({
                    grade:res.data.grade
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
        if(!(Cookies.get("ID")>0)){//Si Cookies.get("ID") n'existe pas on se déconnecte
            this.setState({
                connected:false
            })
        }
    }
    
    /**
     * Déconnecte l'utilisateur en changeant l'état connected
     */
    deconnect(){
        Cookies.remove("ID");//Supression du cookie
        Cookies.remove("KEY");//Suppression du cookie
        this.setState({
            connected:false
        });
    }

    /**
     * Rendu du component
     */
    render(){
        /* Utilisateur redirigé si non connecté */
        if(!this.state.connected){
            Cookies.remove("ID");//Supression du cookie
            Cookies.remove("KEY");//Suppression du cookie
            return (<Redirect to='/'/>); //Renvoi à la page de connexion
        }else if(this.state.pref){
            return (<Redirect to='/preference'/>);//Renvoi à la page des preferences
        }else if(this.state.panel){
            return (<Redirect to='/panel'/>);//Renvoi à la page du panel administrateur
        }else if(this.state.showFiltre && this.state.grade==="nouveau"){
            return (<Redirect to='/abonnement'/>);//Renvoi à la page de l'abonnement
        }
      return(

        <div className="container-fluid margetop10vh">
            <Modal show={this.state.showModal} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.state.modalBody}
                {this.state.modalTitle==="Match !" &&
                    <i className="far fa-kiss-wink-heart"></i>
                }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal()}>
                        Fermer
                    </Button>
                    {this.state.modalTitle==="Nombre de like épuisé" && 
                        <Button variant="primary" onClick={() => {this.setState({showFiltre:true});this.closeModal()}}>
                            S'abonner
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
            {this.state.showMessage == 1 && <ListMessages id={Cookies.get('m_id1')} id2={Cookies.get('m_id2')} unmountMe={this.handleChildUnmount} />}
            <div className="row">
                <div className="col-md">
                    <div className="filtressvg margetop10px" onClick={() => {this.setState({showFiltre:!this.state.showFiltre})}}>
                        <svg style={{padding:"3px"}} className="bi bi-toggles" width="3em" height="3em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M11.5 1h-7a2.5 2.5 0 0 0 0 5h7a2.5 2.5 0 0 0 0-5zm-7-1a3.5 3.5 0 1 0 0 7h7a3.5 3.5 0 1 0 0-7h-7zm0 9a3.5 3.5 0 1 0 0 7h7a3.5 3.5 0 1 0 0-7h-7zm7 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            <path fillRule="evenodd" d="M8 3.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM4.5 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                        </svg>
                    </div>                     
                </div>
                <div className="col-md">
                    <Link className="match" to="/mesmatch"><button className="btn-principale  margetop10px" >mes match</button></Link>
                </div>
                <div className="col-md ">
                    <button 
                        className="btn-principale  margetop10px" 
                        onClick={() => this.setState({pref:true})}>
                            Mon profil
                    </button>
                </div>
                
                {this.state.grade ==="administrateur" &&
                    <div className="col-md">
                        <button 
                            className="btn-principale margetop10px" 
                            onClick={() => this.setState({panel:true})}>
                                Panel administrateur
                        </button>
                    </div>
                }
                
                <div className="col-md">
                    <button 
                    className="btn-principale  margetop10px" 
                    onClick={() => this.deconnect()}>
                        Déconnexion
                    </button>
                </div> 
            </div>
            
                {(this.state.grade !=="nouveau" && this.state.grade !=="" && this.state.showFiltre)&& 
                    <Filtre onChangeTabPersonne={this.onChangeTabPersonne}/>
                }

                
                {(this.state.tabPersonne!==null && this.state.tabPersonne.length > this.state.currentIndex) && 
                    <div className="row margetop20px">
                        <div className="col-lg">
                            <div className="d-none d-lg-block">
                                <button 
                                    className="btn-dislike" 
                                    onClick={() => this.dislike()}>
                                        Dislike
                                </button>
                            </div>
                        </div>
                        <div className="col-lg">
                            <div className="d-none d-lg-block width90">
                                {(this.state.currentIndex!==null && this.state.loaded) &&
                                    <>
                                    <CardId  hisId={this.state.tabPersonne[this.state.currentIndex]}/>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-lg">
                            <div className="d-none d-lg-block">
                                <button 
                                    className="btn-like" 
                                    onClick={() => this.like()}>
                                        Like
                                </button>
                            </div>
                        </div>   
                    </div>
                }
                {(this.state.tabPersonne!==null && this.state.tabPersonne.length <= this.state.currentIndex) &&
                    <div className="row margetop20px">
                    <div className="col-lg">
                        
                    </div>
                    <div className="col-lg">
                        <div className="d-none d-lg-block margetop18">
                            {(this.state.currentIndex!==null && this.state.loaded) &&
                            <Card>
                                <Card.Title>Wow quelle énergie !</Card.Title>
                                <Card.Text>Vous avez épuisé tout notre stock de partenaire</Card.Text>
                                <Card.Text>Revenez plus tard </Card.Text>
                                <Card.Text>
                                    <svg className="bi bi-emoji-smile-upside-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0-1a8 8 0 1 1 0 16A8 8 0 0 1 8 0z"/>
                                        <path fillRule="evenodd" d="M4.285 6.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 4.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 3.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683z"/>
                                        <path d="M7 9.5C7 8.672 6.552 8 6 8s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5zm4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5z"/>
                                    </svg>
                                </Card.Text>
                            </Card>
                            }
                        </div>
                    </div>
                    <div className="col-lg">
                        
                    </div>   
                </div>
                }

                {(this.state.tabPersonne!==null && this.state.tabPersonne.length > this.state.currentIndex) && 
                    <div className="col-lg d-lg-none">
                        <div className="width90 align-card-tel">
                            {(this.state.currentIndex!==null && this.state.loaded) &&
                                <>
                                <CardId  hisId={this.state.tabPersonne[this.state.currentIndex]}/>
                                </>
                            }

                            <div className="row-likes width90">
                                <div className="width-btn-dislike">
                                    <button 
                                        className="btn-dislike-tel" 
                                        onClick={() => this.dislike()}>
                                            Dislike
                                    </button>
                                </div>
                                <div className="width-btn-like">
                                    <button 
                                        className="btn-like-tel" 
                                        onClick={() => this.like()}>
                                            Like
                                    </button>
                                </div>  
                            </div>
                        </div>
                    </div>
                }
                {(this.state.tabPersonne!==null && this.state.tabPersonne.length <= this.state.currentIndex) &&
                    <div className="col-lg d-lg-none"> 
                        <div className="width90 align-card-tel">
                            <Card>
                                <Card.Title>Wow quelle énergie !</Card.Title>
                                <Card.Text>Vous avez épuisé tout notre stock de partenaire</Card.Text>
                                <Card.Text>Revenez plus tard </Card.Text>
                                <Card.Text>
                                    <svg className="bi bi-emoji-smile-upside-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0-1a8 8 0 1 1 0 16A8 8 0 0 1 8 0z"/>
                                        <path fillRule="evenodd" d="M4.285 6.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 4.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 3.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683z"/>
                                        <path d="M7 9.5C7 8.672 6.552 8 6 8s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5zm4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5z"/>
                                    </svg>
                                </Card.Text>
                            </Card> 
                       
                        </div>
                    </div>
                }

            
        </div>
      );
    }
}


export default Pageprincipale;

                    
