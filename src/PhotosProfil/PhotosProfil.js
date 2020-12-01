import React, { Component } from 'react';
import ImageCrop from './CropImage';
import {URL_API} from '../App';
import Cookies from 'js-cookie';
import { Redirect } from "react-router-dom";
import { ProgressBar } from 'react-bootstrap';

/**
 * Composant qui demande à l'utilisateur de 
 * upload une photo de profil
 */

class PhotosProfil extends Component{
    constructor(props) {
        super(props);

        this.state = {
          userProfilePic: '',
          editor: null,
          scaleValue: 1,
          connected:true,
          percentage: 0
        };
    }
    
    /**
     * Met à jour un état
     * @param {editor} editor Reference pour la bibliothèque AvatarEditor 
     */
    setEditorRef = editor => this.setState({ editor })
    
    /**
     * Transforme une image(base 64) en image sous forme de fichier
     * @param {string (base64)} dataurl Image en base 64
     * @param {string} filename Nom d'un fichier
     */
    DataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    /**
     * Met à jour l'état selectedImage en fonction de l'image choisie par l'utilisateur
     * @param {event} fileChangeEvent Evènement de changement du fichier image 
     */
    profileImageChange = (fileChangeEvent) => {
        if(fileChangeEvent.target.files[0]!==undefined){
            const file = fileChangeEvent.target.files[0];
            const { type } = file;
            if ((type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg'))) {
                this.setState({selectedImage: fileChangeEvent.target.files[0]});
            }
        }
    }

    /**
     * Lorsque l'image est rognée, on passe de base64 à fichier png
     */
    onCrop = () => {
        const {editor} = this.state;
        if(editor !=null){
            const url = editor.getImage().toDataURL();
            this.setState({userProfilePic : this.DataURLtoFile(url,"image.png")});
        }
    }

    /**
     * Envoi la photo au back end pour qu'elle soit mise à jour sur le profil de la personne
     * Le changement peut mettre un peu de temps
     * @param {event} event Envoi d'un formulaire
     * Peut être effacer le cache ?
     */
    sendCard(event){
        event.preventDefault();
        const axios = require('axios');  //Requêtes HTTP
        let config = {
          headers: {
          logginid: Cookies.get("ID"),
          logginkey: Cookies.get("KEY")
          },
          onUploadProgress: (ProgressEvent) => {
            const {loaded, total} = ProgressEvent;
            let percent = Math.floor( (loaded*100) /total -1);
            if(percent < 100){
              this.setState({percentage : percent});
            }
          }
        }
        let formData = new FormData();
        formData.append('file',this.state.userProfilePic);

        const url = URL_API+'addProfileImage.php';
          axios.post(url,formData,config)
          .then(res => {
            if(!res.data.connect){
              this.setState({connected:false});
            }else{
              this.setState({percentage : 100});
              console.log("L'actualisation de ton image peut mettre du temps, contacte le support si ça n'a pas changé après 3min");
              this.props.isCropping(false);
            }
          })
          .catch(err => {
            console.log(err);
          });
        }

    /**
     * Change l'état en fonction du grossissement que l'utilisateur choisi
     * @param {event} scaleValueEvent Changement de la valeur de grossissement
     */
    onScaleChange = (scaleValueEvent) => {
        const scaleValue = parseFloat(scaleValueEvent.target.value);
        this.setState({ scaleValue });
    }

    /**
     * Rendu du component
     */
    render(){
      if(!this.state.connected){
        Cookies.remove("ID");
        Cookies.remove("KEY");
        return(<Redirect to='/'/>);
      }
      const {percentage} = this.state;
      return(
        <div className="align-center">
          <div className="input-group">
            <div className="custom-file">
              <input type="file" className="custom-file-input" accept="image/png, image/jpeg, image/jpg" onChange={this.profileImageChange} />
              <label className="custom_file_label" for="inputGroupFile04">Choisir une photo</label>
            </div>
            <div className="input-group-append">
              <button className="btn-simple" type="button" id="inputGroupFile04">valider</button>
            </div>
          </div>
            
            <br/>
            <ImageCrop 
              imageSrc={this.state.selectedImage}
              setEditorRef={this.setEditorRef}
              onCrop={this.onCrop}
              scaleValue={this.state.scaleValue}
              onScaleChange={this.onScaleChange}
              />
              
              {/* Submit */} 
            <form onSubmit={event => this.sendCard(event)}>
              {percentage === 0 ?
                <button className="btn-simple" disabled={this.state.userProfilePic===""} type="submit">Upload</button>
              : <ProgressBar animated now={percentage} label={`${percentage}%`} />
              }
            </form>
        </div>
      );
    }
}

export default PhotosProfil;