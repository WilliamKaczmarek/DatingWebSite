import React, { Component } from 'react';
import {URL_API} from '../App';
import Cookies from 'js-cookie';
import PhotosProfil from '../PhotosProfil/PhotosProfil';

/**
 * Class qui affiche les photos de profil et 
 * qui permet d'en ajouter une si l'utilisateur 
 * en possède moins de 5 
 * Dans les preferences
 */
class EditProfilePhoto extends Component{
    constructor(props) {
        super(props);

        this.state = {
          tabImage : [
              false,
              false,
              false,
              false,
              false
          ],
          crop:false
        };
      }

    /**
     * Lorsque le component a fini de charger
     */
    componentDidMount(){
      this.initTabImage();
    }

    /**
     * Icône de poubelle
     */
    trashIcon = () => {
      return(
      <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
      );
    }

    /**
     * Met à jour l'état en fonction des photos que l'utilisateur a sur son profil
     */
    initTabImage(){
      const axios = require('axios');  //Requêtes HTTP
        const url = URL_API+'getPreferenceCard.php?id='+Cookies.get('ID');
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
                crop:false
            });
          })
          .catch(err => {
            console.log(err);
          });
    }

    /**
     * Met à jour un état
     * @param {boolean} cropp Vrai ou faux selon si l'utilisateur rogne une photo ou non 
     */
    isCropping = (cropp) => {
      this.setState({
        crop:false
      });
      this.initTabImage();
    }

    /**
     * Supprimer une photo du profil de l'utilisateur
     * @param {integer} num Numéro de la place de la photo de l'utilisateur
     */
    supprImage(num){
      const axios = require('axios');  //Requêtes HTTP
      let config = {
        headers: {
        logginid: Cookies.get("ID"),
        logginkey: Cookies.get("KEY")
        }
      }
      let formData = new FormData();
        formData.append('number',num);

      const url = URL_API+'delProfileImage.php?id='+Cookies.get('ID');
      axios.post(url,formData,config)
        .then(res => {
          this.initTabImage();
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
        <div>
          <div className="row">
            {!(this.state.tabImage[0] || this.state.tabImage[1] || this.state.tabImage[2] || this.state.tabImage[3] || this.state.tabImage[4]) &&
              <div className="align-center" >Vous n'avez pas d'image de profile</div>
            }
            {(this.state.tabImage[0]) &&
            <div className="col-lg"> 
                <img width="200px" src={"https://projetsiteeisti.yj.fr/imageProfil/"+Cookies.get('ID')+"-1.png"} alt="Profile 1" />
                <br/>
                <button className="btn-simple" onClick={() => this.supprImage(1)}>Supprimer 
                  {this.trashIcon()}
                </button>
            </div>
            }{(this.state.tabImage[1]) &&
            <div className="col-lg">
                <img width="200px" src={"https://projetsiteeisti.yj.fr/imageProfil/"+Cookies.get('ID')+"-2.png"} alt="Profile 2" />
                <br/>
                <button className="btn-simple" onClick={() => this.supprImage(2)}>Supprimer
                  {this.trashIcon()}
                </button>
            </div >
            }{(this.state.tabImage[2]) &&
            <div className="col-lg">
                <img width="200px" src={"https://projetsiteeisti.yj.fr/imageProfil/"+Cookies.get('ID')+"-3.png"} alt="Profile 3" />
                <br/>
                <button className="btn-simple" onClick={() => this.supprImage(3)}>Supprimer
                  {this.trashIcon()}
                </button>
            </div>
            }{(this.state.tabImage[3]) &&
            <div className="col-lg">
                <img width="200px" src={"https://projetsiteeisti.yj.fr/imageProfil/"+Cookies.get('ID')+"-4.png"} alt="Profile 4" />
                <br/>
                <button className="btn-simple" onClick={() => this.supprImage(4)}>Supprimer
                  {this.trashIcon()}
                </button>
            </div>
            }{(this.state.tabImage[4]) &&
            <div className="col-lg">
                <img width="200px" src={"https://projetsiteeisti.yj.fr/imageProfil/"+Cookies.get('ID')+"-5.png"} alt="Profile 5" />
                <br/>
                <button className="btn-simple" onClick={() => this.supprImage(5)}>Supprimer
                  {this.trashIcon()}
                </button>
            </div>
            }
          </div>
          <div className="row ">
            {(!(this.state.tabImage[0] && this.state.tabImage[1] && this.state.tabImage[2] && this.state.tabImage[3] && this.state.tabImage[4]) && (!this.state.crop)) &&
              <div className="align-center">
                <button className="btn-simple " onClick={() => this.setState({crop:true})}><i className="fas fa-camera"></i>Ajouter une photo !</button>
              </div>            
            }
          </div>
          <div className="row">
            {this.state.crop &&
              <PhotosProfil isCropping={this.isCropping}/>
            }
          </div>   
        </div>
      );
    }
}

export default EditProfilePhoto;