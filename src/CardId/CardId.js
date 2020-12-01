import React, { Component } from 'react';
import Cookies from 'js-cookie';
import {Card, Carousel} from 'react-bootstrap';
import {URL_API} from '../App';
import { getDistance } from 'geolib';

/**
 * Class qui affiche un.e prétendant.e
 * en fonction de this.props.hisId et Cookies.get('ID')
 */

class CardId extends Component{//this.props.hisId
    constructor(props) {
        super(props);

        this.state = {
          tabImage : [false,false,false,false,false],//Possession image 1,2,3,4,5
          tabInfo : [
            'Bob', //0 Prénom
            18,//1 Age
            0,//2 Distance en km faut l'id du gars
            "C'est moi :)",//3 Bio
            "none",//4 Etude
            100,//5 Taille en cm
            "none",//6 Yeux
            "none",//7 Cheveux
            "none",//8 Sport
            "none",//9 Alcool
            "none",//10 Tabac
            "none",//11 Animaux
            "none",//12 Religion
            "none"//13 Signe Astro
          ],
          certif:"0",
          oldId:"0"
        };
      }

    /**
     * Lorsque le component a fini de chargé
     */
    componentDidMount(){
        this.initTabsState();//chargement du tableau
    }

    /**
     * Met à jour l'utilisateur courant en fonction de la propriété
     * envoyée par le component parent
     * @param {integer} props 
     */
    componentDidUpdate(props){
        if(this.state.oldId!==this.props.hisId){//Si l'id a changé
        this.initTabsState();
        }
    }

    /**
     * Met à jour l'état avec toutes les informations relative à l'ID
     */
    initTabsState(){
        const axios = require('axios');  //Requêtes HTTP
        const url = URL_API+'getPreferenceCard.php?id='+this.props.hisId+'&info=yes&certif=yes&myId='+Cookies.get('ID');
          axios.get(url)
          .then(res => {
            this.setState({
                tabImage:[
                    res.data.tabImage[0],
                    res.data.tabImage[1],
                    res.data.tabImage[2],
                    res.data.tabImage[3],
                    res.data.tabImage[4]
                ],
                tabInfo:[
                    res.data.tabPref[0],
                    this.ageCalcul(res.data.tabPref[1]),
                    parseInt(this.calculDistance(res.data.myCoor,res.data.tabPref[2])/1000,10),//a calculer avec l'id actuel
                    res.data.tabPref[3],
                    res.data.tabPref[4],
                    res.data.tabPref[5],
                    res.data.tabPref[6],
                    res.data.tabPref[7],
                    res.data.tabPref[8],
                    res.data.tabPref[9],
                    res.data.tabPref[10],
                    res.data.tabPref[11],
                    res.data.tabPref[12],
                    res.data.tabPref[13]
                ],
                certif:res.data.certif,
                oldId:this.props.hisId
            });
          })
          .catch(err => {
            console.log(err);
          });
    }

    /**
     * Calcule la distance en mètre entre deux point géographique
     * @param {string} coor1 Coordonnées GPS du point 1 (séparé par un ';')
     * @param {string} coor2 Coordonnées GPS du point 2 (séparé par un ';')
     */
    calculDistance(coor1,coor2){
        if(coor1!==undefined && coor2!==0){
            const tabCoor1 = coor1.split(';');
            const tabCoor2 = coor2.split(';');
            return(getDistance(
                { latitude: tabCoor1[1], longitude: tabCoor1[0] },
                { latitude: tabCoor2[1], longitude: tabCoor2[0] }
            ));
        }
    }

    /**
     * Calcul l'age d'une personne en fonction de sa date d'anniversaire
     * et de la date actuelle
     * @param {Date} birthday Date d'anniversaire d'un utilisateur 
     */
    ageCalcul(birthday){
        let dateActu = new Date();
        let dateBirth = new Date(birthday);
        let age = dateActu.getFullYear()-dateBirth.getFullYear();
        if((dateBirth.getMonth()-dateActu.getMonth())>0){age--;}
        else if((dateBirth.getMonth()===dateActu.getMonth()) && (dateBirth.getDate()-dateActu.getDate()>0)){age--;}
        return(age);
    }

    /**
     * Rendu du component
     */
    render(){
      return(
        <div >
            {/* width obligatoire pour réguler la taille des images */}
          <Card style={{borderRadius:"15px"}}>
          <Carousel key={this.props.hisId}>
                {(!this.state.tabImage[0] && 
                !this.state.tabImage[1] && 
                !this.state.tabImage[2] &&
                !this.state.tabImage[3] &&
                !this.state.tabImage[4]) &&
                <Carousel.Item>
                <img
                    style={{borderTopRightRadius:"15px",borderTopLeftRadius:"15px"}}
                    className="d-block w-100"
                    src="https://projetsiteeisti.yj.fr/imageProfil/0.png"
                    alt="Pas de png de profil"
                />
                </Carousel.Item>
                }{this.state.tabImage[0] && 
                    <Carousel.Item>
                        <img
                        style={{borderTopRightRadius:"15px",borderTopLeftRadius:"15px"}}
                        className="d-block w-100"
                        src={"https://projetsiteeisti.yj.fr/imageProfil/"+this.state.oldId+"-1.png"}
                        alt="Profile 1"
                        />
                    </Carousel.Item>
                }{this.state.tabImage[1] && 
                    <Carousel.Item>
                        <img
                        style={{borderTopRightRadius:"15px",borderTopLeftRadius:"15px"}}
                        className="d-block w-100"
                        src={"https://projetsiteeisti.yj.fr/imageProfil/"+this.state.oldId+"-2.png"}
                        alt="Profile 2"
                        />
                    </Carousel.Item>
                }{this.state.tabImage[2] && 
                    <Carousel.Item>
                        <img
                        style={{borderTopRightRadius:"15px",borderTopLeftRadius:"15px"}}
                        className="d-block w-100"
                        src={"https://projetsiteeisti.yj.fr/imageProfil/"+this.state.oldId+"-3.png"}
                        alt="Profile 3"
                        />
                    </Carousel.Item>
                }{this.state.tabImage[3] && 
                    <Carousel.Item>
                        <img
                        style={{borderTopRightRadius:"15px",borderTopLeftRadius:"15px"}}
                        className="d-block w-100"
                        src={"https://projetsiteeisti.yj.fr/imageProfil/"+this.state.oldId+"-4.png"}
                        alt="Profile 4"
                        />
                    </Carousel.Item>
                }{this.state.tabImage[4] && 
                    <Carousel.Item>
                        <img
                        style={{borderTopRightRadius:"15px",borderTopLeftRadius:"15px"}}
                        className="d-block w-100"
                        src={"https://projetsiteeisti.yj.fr/imageProfil/"+this.state.oldId+"-5.png"}
                        alt="Profile 5"
                        />
                    </Carousel.Item>
                }
            </Carousel>
            <Card.Body style={{overflowY: "scroll",height:"25vh"}}>
                {/* Ici mettre bio et certaines caractéristiques */}
                <Card.Title>{this.state.tabInfo[0]+", "+this.state.tabInfo[1]+"ans "}
                {this.state.certif==="1" && <i className="fas fa-check-circle fa-xs blue-text"></i>}
                </Card.Title>
                <Card.Subtitle>à {this.state.tabInfo[2]} km</Card.Subtitle>
                <Card.Text>{this.state.tabInfo[3]}</Card.Text>
                {/* Peut-être faire fiche technique que pour premium */}
                <Card.Subtitle>Ma fiche technique : </Card.Subtitle>
                <Card.Text>
                        <strong>Taille : </strong>{this.state.tabInfo[5]/100} m<br/>
                        {this.state.tabInfo[4]!=="none" && <><strong>Etude : </strong>{this.state.tabInfo[4]}<br/></>}
                        {this.state.tabInfo[6]!=="none" && <><strong>Yeux : </strong>{this.state.tabInfo[6]}<br/></>}
                        {this.state.tabInfo[7]!=="none" && <><strong>Cheveux : </strong>{this.state.tabInfo[7]}<br/></>}
                        {this.state.tabInfo[8]!=="none" && <><strong>Sport : </strong>{this.state.tabInfo[8]}<br/></>}
                        {this.state.tabInfo[9]!=="none" && <><strong>Alcool : </strong>{this.state.tabInfo[9]}<br/></>}
                        {this.state.tabInfo[10]!=="none" && <><strong>Tabac : </strong>{this.state.tabInfo[10]}<br/></>}
                        {this.state.tabInfo[11]!=="none" && <><strong>Animaux : </strong>{this.state.tabInfo[11]}<br/></>}
                        {this.state.tabInfo[12]!=="none" && <><strong>Religion : </strong>{this.state.tabInfo[12]}<br/></>}
                        {this.state.tabInfo[13]!=="none" && <><strong>Signe astrologique : </strong>{this.state.tabInfo[13]}<br/></>}
                </Card.Text>
            </Card.Body>
        </Card>
     </div>
     );
    }
}

export default CardId;