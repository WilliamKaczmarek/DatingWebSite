import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {URL_API} from '../App';
import Cookies from 'js-cookie';

/**
 * Class qui permet d'appliquer un filtre lors 
 * des propositions de partenaires dans la page principale
 */
class Filtre extends Component{
    constructor(props) {
        super(props);
        this.state = {
            checkedA: true,
            showFiltreEtude: false,
            TabEtudes: [
                {name: "Lycée" , value: 1},
                {name: "Université", value: 1},
                {name: "Ecole d'Ingénieur", value: 1},
                {name: "Ecole de commerce", value: 1},
                {name: "Ecole supérieur", value: 1},
                {name: "Reconversion", value: 1},
                {name: "Sabatique", value: 1},
            ],
            showFiltreSport: false,
            TabSport: [
                {name: "Passionée" , value: 1},
                {name: "Régulièrement", value: 1},
                {name: "Parfois", value: 1},
                {name: "Une fois au chalet", value: 1},
                {name: "Jamais", value: 1},
            ],
            showFiltreYeux: false,
            TabYeux: [
                {name: "Noir" , value: 1},
                {name: "Marron", value: 1},
                {name: "Vert", value: 1},
                {name: "Bleu", value: 1},
                {name: "Verron", value: 1},
                {name: "Autre", value: 1},

            ],
           showFiltreCheveux: false,
            TabCheveux: [
                {name: "Noir" , value: 1},
                {name: "Brun", value: 1},
                {name: "Auburn", value: 1},
                {name: "Châtain", value: 1},
                {name: "Roux", value: 1},
                {name: "Blond", value: 1},
                {name: "Blanc", value: 1},
                {name: "Autre", value: 1},

            ],
            showFiltreAlcool: false,
            TabAlcool: [
                {name: "Tous les jours" , value: 1},
                {name: "Régulièrement", value: 1},
                {name: "A l'occasion", value: 1},
                {name: "Jamais", value: 1},
            ],
            showFiltreTabac: false,
            TabTabac: [
                {name: "Fréquemment", value: 1},
                {name: "A l'occasion", value: 1},
                {name: "Jamais", value: 1},
            ],
           showFiltreReligion: false,
            TabReligion: [
                {name: "Agnosticisme" , value: 1},
                {name: "Athéisme", value: 1},
                {name: "Bouddhisme", value: 1},
                {name: "Christianisme", value: 1},
                {name: "Hindouisme", value: 1},
                {name: "Jaïnisme", value: 1},
                {name: "Judaïsme", value: 1},
                {name: "Islam", value: 1},
                {name: "Zoroastrisme", value: 1},
                {name: "Sikhisme", value: 1},
                {name: "Spiritualité", value: 1},
                {name: "Autre", value: 1},
            ],
            showFiltreAstrologie: false,
            TabAstrologie: [
                {name: "Verseau" , value: 1},
                {name: "Poissons", value: 1},
                {name: "Bélier", value: 1},
                {name: "Taureau", value: 1},
                {name: "Gémeaux", value: 1},
                {name: "Cancer", value: 1},
                {name: "Lion", value: 1},
                {name: "Vierge", value: 1},
                {name: "Scorpion", value: 1},
                {name: "Sagittaire", value: 1},
                {name: "Capricorne", value: 1},
                {name: "Balance", value: 1},
            ],            
            showFiltreAnimaux: false,
            TabAnimaux: [
                {name: "Chiens" , value: 1},
                {name: "Chats", value: 1},
                {name: "Beaucoup", value: 1},
                {name: "Autres", value: 1},
                {name: "Aucun", value: 1},
                {name: "Allergique", value: 1},
            ],
            Actif: "",
            init:0,
            connect:true
        };
/* Bind(this) pour les fonctions dédiés aux filtres ETUDE */
this.handleChangeEtude = this.handleChangeEtude.bind(this);
this.handleClickInEtude = this.handleClickInEtude.bind(this);
this.handleClickOutEtude = this.handleClickOutEtude.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Sport */
this.handleChangeSport = this.handleChangeSport.bind(this);
this.handleClickInSport = this.handleClickInSport.bind(this);
this.handleClickOutSport = this.handleClickOutSport.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Yeux */
this.handleChangeYeux = this.handleChangeYeux.bind(this);
this.handleClickInYeux = this.handleClickInYeux.bind(this);
this.handleClickOutYeux = this.handleClickOutYeux.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Cheveux */
this.handleChangeCheveux = this.handleChangeCheveux.bind(this);
this.handleClickInCheveux = this.handleClickInCheveux.bind(this);
this.handleClickOutCheveux = this.handleClickOutCheveux.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Alcool */
this.handleChangeAlcool = this.handleChangeAlcool.bind(this);
this.handleClickInAlcool = this.handleClickInAlcool.bind(this);
this.handleClickOutAlcool = this.handleClickOutAlcool.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Tabac */
this.handleChangeTabac = this.handleChangeTabac.bind(this);
this.handleClickInTabac = this.handleClickInTabac.bind(this);
this.handleClickOutTabac = this.handleClickOutTabac.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Religion */
this.handleChangeReligion = this.handleChangeReligion.bind(this);
this.handleClickInReligion = this.handleClickInReligion.bind(this);
this.handleClickOutReligion = this.handleClickOutReligion.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Astrologie */
this.handleChangeAstrologie = this.handleChangeAstrologie.bind(this);
this.handleClickInAstrologie = this.handleClickInAstrologie.bind(this);
this.handleClickOutAstrologie = this.handleClickOutAstrologie.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Animaux */
this.handleChangeAnimaux = this.handleChangeAnimaux.bind(this);
this.handleClickInAnimaux = this.handleClickInAnimaux.bind(this);
this.handleClickOutAnimaux = this.handleClickOutAnimaux.bind(this);
/* Bind(this) pour les fonctions dédiés aux filtres Actif */
this.handleChangeActif = this.handleChangeActif.bind(this);
}


      /**
       * Envoie de tous les states tableaux des filtres à la BDD
       * Actualise les filtres dans la BDD
       * @param {event} event Action du form par le bouton Submit
       */
     loadTableauPersonne(event){
      event.preventDefault();
      let formData = new FormData();
      if(this.state.Actif!==""){
        formData.append('filtre',this.state.Actif);
        let TabRenvoi=this.state.TabEtudes;
        if(this.state.Actif==="Etudes"){TabRenvoi=this.state.TabEtudes;}
        else if(this.state.Actif==="Activités Physique"){TabRenvoi=this.state.TabSport;}
        else if(this.state.Actif==="Yeux"){TabRenvoi=this.state.TabYeux;}
        else if(this.state.Actif==="Cheveux"){TabRenvoi=this.state.TabCheveux;}
        else if(this.state.Actif==="Alcool"){TabRenvoi=this.state.TabAlcool;}
        else if(this.state.Actif==="Tabac"){TabRenvoi=this.state.TabTabac;}
        else if(this.state.Actif==="Religion"){TabRenvoi=this.state.TabReligion;}
        else if(this.state.Actif==="Astrologie"){TabRenvoi=this.state.TabAstrologie;}
        else if(this.state.Actif==="Animaux"){TabRenvoi=this.state.TabAnimaux;}
        formData.append('tableau',JSON.stringify(TabRenvoi));
        formData.append('certificate',this.state.checkedA);
        const url = URL_API+'getTabPersonne.php';
        const axios = require('axios').default;  //Requêtes HTTP
        let config = {
            headers: {
            logginid: Cookies.get("ID"),
            logginkey: Cookies.get("KEY")
            }
        }
        axios.post(url,formData,config)
        .then(res => {
            if(res.data.connected){ //Mise à jour de connected si réponse négative
                this.props.onChangeTabPersonne(res.data.tab);
            }
        })
        .catch(err => {
            console.log(err);
        });
      }
    }


      /**
       * réinitialise la table des filtres dans la BDD de l'utilisateur
       * Quand le bouton "annuler les filtres est préssé"
       */
    resetTab(){
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
              this.props.onChangeTabPersonne(res.data.tab);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    /**
       * Met à jour le state Checked A pour le bouton switch pour afficher ou non que les profils premium
       *Bouton switch 
       * @param {event} event clique sur un bouton
       */  
    handleChangeCheck(event){
      this.setState({
        [event.target.name]: event.target.checked 
     })
    }
    /**
       * Met à jour le state showFiltre etude en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */ 
    handleClickInEtude(event) {
      this.setState({showFiltreEtude: true});
    }
    /**
       * Met à jour le state showFiltre etude en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton
       */
    handleClickOutEtude(event) {
      this.setState({showFiltreEtude: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox
       */
    handleChangeEtude(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabEtudes;
      tabTemp[num].value=this.state.TabEtudes[num].value===1?0:1;
      this.setState({
        TabEtudes:tabTemp
      });
    }
    /**
       * Met à jour le state showFiltre sport en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */     
    handleClickInSport(event) {
      this.setState({showFiltreSport: true});
    }
    /**
       * Met à jour le state showFiltreSport en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton
       */
    handleClickOutSport(event) {
      this.setState({showFiltreSport: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox
       */
    handleChangeSport(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabSport;
      tabTemp[num].value=this.state.TabSport[num].value===1?0:1;
      this.setState({
        TabSport:tabTemp
      });
    }
    /**
       * Met à jour le state showFiltreYeux en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */ 
    handleClickInYeux(event) {
      this.setState({showFiltreYeux: true});
    }
    /**
       * Met à jour le state showFiltreYeux en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton     
       */
    handleClickOutYeux(event) {
      this.setState({showFiltreYeux: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox
       */
    handleChangeYeux(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabYeux;
      tabTemp[num].value=this.state.TabYeux[num].value===1?0:1;
      this.setState({
        TabYeux:tabTemp
      });
    }
    /**
       * Met à jour le state showFiltreCheveux en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */ 
    handleClickInCheveux(event) {
      this.setState({showFiltreCheveux: true});
    }
    /**
       * Met à jour le state showFiltreCheveux en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton      
       */
    handleClickOutCheveux(event) {
      this.setState({showFiltreCheveux: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox
       */
    handleChangeCheveux(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabCheveux;
      tabTemp[num].value=this.state.TabCheveux[num].value===1?0:1;
      this.setState({
        TabCheveux:tabTemp
      });
    }
    /**
       * Met à jour le state showFiltreAlcool en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */ 
    handleClickInAlcool(event) {
      this.setState({showFiltreAlcool: true});
    }
    /**
       * Met à jour le state showFiltreAlcool en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton    
       */
    handleClickOutAlcool(event) {
      this.setState({showFiltreAlcool: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox
       */
    handleChangeAlcool(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabAlcool;
      tabTemp[num].value=this.state.TabAlcool[num].value===1?0:1;
      this.setState({
        TabAlcool:tabTemp
      });
    }
    /**
       * Met à jour le state showFiltreTabac en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */ 
   handleClickInTabac(event) {
      this.setState({showFiltreTabac: true});
    }
    /**
       * Met à jour le state showFiltreTabac en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton    
       */
    handleClickOutTabac(event) {
      this.setState({showFiltreTabac: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox
       */
    handleChangeTabac(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabTabac;
      tabTemp[num].value=this.state.TabTabac[num].value===1?0:1;
      this.setState({
        TabTabac:tabTemp
      });
    }
    /**
       * Met à jour le state showFiltreReligion en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */ 
    handleClickInReligion(event) {
      this.setState({showFiltreReligion: true});
    }
    /**
       * Met à jour le state showFiltreReligion en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton    
       */
    handleClickOutReligion(event) {
      this.setState({showFiltreReligion: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox

       */
    handleChangeReligion(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabReligion;
      tabTemp[num].value=this.state.TabReligion[num].value===1?0:1;
      this.setState({
        TabReligion:tabTemp
      });
    }
    /**
       * Met à jour le state showFiltreAstrologie en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */ 
    handleClickInAstrologie(event) {
      this.setState({showFiltreAstrologie: true});
    }
    /**
       * Met à jour le state showFiltreAstrologie en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton 
       */
    handleClickOutAstrologie(event) {
      this.setState({showFiltreAstrologie: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox
       */
    handleChangeAstrologie(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabAstrologie;
      tabTemp[num].value=this.state.TabAstrologie[num].value===1?0:1;
      this.setState({
        TabAstrologie:tabTemp
      });
       }  
    /**
       * Met à jour le state showFiltreAnimaux en true pour afficher les différentes options
       *Affiche les options du filtre
       * @param {event} event clique sur un bouton
       */ 
    handleClickInAnimaux(event) {
      this.setState({showFiltreAnimaux: true});
    }
    /**
       * Met à jour le state showFiltreAnimaux en False pour cacher les différentes options
       *Cache les options du filtres
       * @param {event} event clique sur un bouton
       */
    handleClickOutAnimaux(event) {
      this.setState({showFiltreAnimaux: false});
    }
    /**
       * Met à jour state de l'attibut Checked de l'input selectionné, ainsi que le state de la valeur du tableau selon son index
       *Check ou non la checkbox et change le state du tabl
       * @param {event} event clique sur une checkbox
       */
    handleChangeAnimaux(event) {
      this.setState({isChecked: !this.state.isChecked});
      const num = event.target.value;
      let tabTemp = this.state.TabAnimaux;
      tabTemp[num].value=this.state.TabAnimaux[num].value===1?0:1;
      this.setState({
        TabAnimaux:tabTemp
      });
      }  
    /**
       * Met à jour le state Actif en la valeur de l'option selectionné par l'utilisateur
       *Applique le filtre selectionné
       * @param {event} event Changement de la valeur du state Actif
       */ 
      handleChangeActif(event) {
        this.setState({
          Actif: event.target.value
        });
      }   

  /**
     * Rendu du component
     */                       
    render(){
      return(
        <div className="row margetop10px">
          <div className="width90 align-card-tel margetop20px">
              {/* Formulaire des Filtres de la personne' */}
              <form onSubmit={event=> this.loadTableauPersonne(event)}>
              {/* Voir Uniquement des personnes vérifier */}
              <div className="align-filtre_profils-verif ">
                <FormGroup row>
                  <FormControlLabel labelPlacement='start' label="Voir seulement des profils vérifié :" control={<Switch
                    checked={this.state.checkedA} onChange={event=> this.handleChangeCheck(event)} name="checkedA" />}
                    />
                </FormGroup>
              </div>

              {/* Filtre Etude */}
              {this.state.showFiltreEtude===false && <div className="col-xl"><label htmlFor="Etude"><i className="fas fa-user-graduate"></i>Etudes</label> <button className="btn-simple" onClick={()=>
                  this.handleClickInEtude()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreEtude===true && <div>
                <label htmlFor="Etude">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label  htmlFor="lycée">Lycée</label>
                  <input type="checkbox" id="lycée" name="lycée" value="0"
                    checked={this.state.TabEtudes[0].value===1?true:false} onChange={this.handleChangeEtude} />

                  <label htmlFor="Université">Université</label>
                  <input type="checkbox" id="Université" name="Université" value="1"
                    checked={this.state.TabEtudes[1].value===1?true:false} onChange={this.handleChangeEtude} />

                  <label htmlFor="ing">Ecole d'Igénieur</label>
                  <input type="checkbox" id="ing" name="Ecole d'Ingénieur" value="2"
                    checked={this.state.TabEtudes[2].value===1?true:false} onChange={this.handleChangeEtude} />

                  <label htmlFor="eco">Ecole de commerce</label>
                  <input type="checkbox" id="eco" name="Ecole de commerce" value="3"
                    checked={this.state.TabEtudes[3].value===1?true:false} onChange={this.handleChangeEtude} />

                  <label htmlFor="sup">Ecole supérieur</label>
                  <input type="checkbox" id="sup" name="Ecole supérieur" value="4"
                    checked={this.state.TabEtudes[4].value===1?true:false} onChange={this.handleChangeEtude} />

                  <label htmlFor="Reconversion">Reconversion</label>
                  <input type="checkbox" id="Reconversion" name="Reconversion" value="5"
                    checked={this.state.TabEtudes[5].value===1?true:false} onChange={this.handleChangeEtude} />

                  <label htmlFor="saba">Année sabatique</label>
                  <input type="checkbox" id="saba" name="Sabatique" value="6"
                    checked={this.state.TabEtudes[6].value===1?true:false} onChange={this.handleChangeEtude} />
                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutEtude()}>Fermer</button>
              </div>}
              {/* Filtre Sport */}
              {this.state.showFiltreSport===false && <div className="col-xl"><label htmlFor="Sport"><i className="fas fa-dumbbell"></i>Activités Physique</label> <button className="btn-simple"
                  onClick={()=> this.handleClickInSport()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreSport===true && <div>
                <label htmlFor="Sport">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label htmlFor="Passionée">Passionée</label>
                  <input type="checkbox" id="Passionée" name="Passionée" value="0"
                    checked={this.state.TabSport[0].value===1?true:false} onChange={this.handleChangeSport} />

                  <label htmlFor="Régulièrement">Régulièrement</label>
                  <input type="checkbox" id="Régulièrement" name="Régulièrement" value="1"
                    checked={this.state.TabSport[1].value===1?true:false} onChange={this.handleChangeSport} />

                  <label htmlFor="Parfois">Parfois</label>
                  <input type="checkbox" id="Parfois" name="Parfois" value="2"
                    checked={this.state.TabSport[2].value===1?true:false} onChange={this.handleChangeSport} />

                  <label htmlFor="chalet">Une fois au chalet</label>
                  <input type="checkbox" id="chalet" name="Une fois au chalet" value="3"
                    checked={this.state.TabSport[3].value===1?true:false} onChange={this.handleChangeSport} />

                  <label htmlFor="Jamais">Jamais</label>
                  <input type="checkbox" id="Jamais" name="Jamais" value="4"
                    checked={this.state.TabSport[4].value===1?true:false} onChange={this.handleChangeSport} />

                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutSport()}>Fermer</button>
              </div>}
              {/* Filtre Yeux */}
              {this.state.showFiltreYeux===false && <div className="col-xl"><label htmlFor="Yeux"><i className="far fa-eye"></i>Couleur des Yeux</label> <button className="btn-simple"
                  onClick={()=> this.handleClickInYeux()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreYeux===true && <div>
                <label htmlFor="Yeux">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label htmlFor="Noir">Noir</label>
                  <input type="checkbox" id="Noir" name="Noir" value="0"
                    checked={this.state.TabYeux[0].value===1?true:false} onChange={this.handleChangeYeux} />

                  <label htmlFor="Marron">Marron</label>
                  <input type="checkbox" id="Marron" name="Marron" value="1"
                    checked={this.state.TabYeux[1].value===1?true:false} onChange={this.handleChangeYeux} />

                  <label htmlFor="Vert">Vert</label>
                  <input type="checkbox" id="Vert" name="Vert" value="2"
                    checked={this.state.TabYeux[2].value===1?true:false} onChange={this.handleChangeYeux} />

                  <label htmlFor="Bleu">Bleu</label>
                  <input type="checkbox" id="Bleu" name="Bleu" value="3"
                    checked={this.state.TabYeux[3].value===1?true:false} onChange={this.handleChangeYeux} />

                  <label htmlFor="Verron">Verron</label>
                  <input type="checkbox" id="Verron" name="Verron" value="4"
                    checked={this.state.TabYeux[4].value===1?true:false} onChange={this.handleChangeYeux} />
                  <label htmlFor="Autre">Autre</label>
                  <input type="checkbox" id="Autre" name="Autre" value="5"
                    checked={this.state.TabYeux[5].value===1?true:false} onChange={this.handleChangeYeux} />
                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutYeux()}>Fermer</button>
              </div>}
              {/* Filtre Cheveux */}
              {this.state.showFiltreCheveux===false && <div className="col-xl"><label htmlFor="Cheveux"><i className="fas fa-cut"></i>Couleur des Cheveux</label> <button className="btn-simple"
                  onClick={()=> this.handleClickInCheveux()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreCheveux===true && <div>
                <label htmlFor="Cheveux">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label htmlFor="Noir">Noir</label>
                  <input type="checkbox" id="Noir" name="Noir" value="0"
                    checked={this.state.TabCheveux[0].value===1?true:false} onChange={this.handleChangeCheveux} />

                  <label htmlFor="Brun">Brun</label>
                  <input type="checkbox" id="Brun" name="Brun" value="1"
                    checked={this.state.TabCheveux[1].value===1?true:false} onChange={this.handleChangeCheveux} />

                  <label htmlFor="Auburn">Auburn</label>
                  <input type="checkbox" id="Auburn" name="Auburn" value="2"
                    checked={this.state.TabCheveux[2].value===1?true:false} onChange={this.handleChangeCheveux} />

                  <label htmlFor="Châtain">Châtain</label>
                  <input type="checkbox" id="Châtain" name="Châtain" value="3"
                    checked={this.state.TabCheveux[3].value===1?true:false} onChange={this.handleChangeCheveux} />

                  <label htmlFor="Roux">Roux</label>
                  <input type="checkbox" id="Roux" name="Roux" value="4"
                    checked={this.state.TabCheveux[4].value===1?true:false} onChange={this.handleChangeCheveux} />
                  <label htmlFor="Blond">Blond</label>
                  <input type="checkbox" id="Blond" name="Blond" value="5"
                    checked={this.state.TabCheveux[5].value===1?true:false} onChange={this.handleChangeCheveux} />
                  <label htmlFor="Blanc">Blanc</label>
                  <input type="checkbox" id="Blanc" name="Blanc" value="6"
                    checked={this.state.TabCheveux[6].value===1?true:false} onChange={this.handleChangeCheveux} />
                  <label htmlFor="Autre">Autre</label>
                  <input type="checkbox" id="Autre" name="Autre" value="6"
                    checked={this.state.TabCheveux[6].value===1?true:false} onChange={this.handleChangeCheveux} />
                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutCheveux()}>Fermer</button>
              </div>}
              {/* Filtre Alcool */}
              {this.state.showFiltreAlcool===false && <div className="col-xl"><label htmlFor="Alcool"><i className="fas fa-cocktail"></i>Alcool</label> <button className="btn-simple" onClick={()=>
                  this.handleClickInAlcool()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreAlcool===true && <div>
                <label htmlFor="Alcool">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label htmlFor="Tous les jours">Tous les jours</label>
                  <input type="checkbox" id="Tous les jours" name="Tous les jours" value="0"
                    checked={this.state.TabAlcool[0].value===1?true:false} onChange={this.handleChangeAlcool} />

                  <label htmlFor="Régulièrement">Régulièrement</label>
                  <input type="checkbox" id="Régulièrement" name="Régulièrement" value="1"
                    checked={this.state.TabAlcool[1].value===1?true:false} onChange={this.handleChangeAlcool} />

                  <label htmlFor="A l'occasion">A l'occasion</label>
                  <input type="checkbox" id="A l'occasion" name="A l'occasion" value="2"
                    checked={this.state.TabAlcool[2].value===1?true:false} onChange={this.handleChangeAlcool} />


                  <label htmlFor="Jamais">Jamais</label>
                  <input type="checkbox" id="Jamais" name="Jamais" value="3"
                    checked={this.state.TabAlcool[3].value===1?true:false} onChange={this.handleChangeAlcool} />

                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutAlcool()}>Fermer</button>
              </div>}
              {/* Filtre Tabac */}
              {this.state.showFiltreTabac===false && <div className="col-xl"><label htmlFor="Tabac"><i className="fas fa-smoking"></i>Tabac</label> <button className="btn-simple" onClick={()=>
                  this.handleClickInTabac()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreTabac===true && <div>
                <label htmlFor="Tabac">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label htmlFor="Fréquemment">Fréquemment</label>
                  <input type="checkbox" id="Fréquemment" name="Fréquemment" value="0"
                    checked={this.state.TabTabac[0].value===1?true:false} onChange={this.handleChangeTabac} />

                  <label htmlFor="A l'occasion">A l'occasion</label>
                  <input type="checkbox" id="A l'occasion" name="A l'occasion" value="1"
                    checked={this.state.TabTabac[1].value===1?true:false} onChange={this.handleChangeTabac} />


                  <label htmlFor="Jamais">Jamais</label>
                  <input type="checkbox" id="Jamais" name="Jamais" value="2"
                    checked={this.state.TabTabac[2].value===1?true:false} onChange={this.handleChangeTabac} />

                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutTabac()}>Fermer</button>
              </div>}
              {/* Filtre Religion */}
              {this.state.showFiltreReligion===false && <div className="col-xl"><label htmlFor="Religion"><i className="fas fa-church"></i>Religion</label> <button className="btn-simple"
                  onClick={()=> this.handleClickInReligion()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreReligion===true && <div>
                <label htmlFor="Religion">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label htmlFor="Agnosticisme">Agnosticisme</label>
                  <input type="checkbox" id="Agnosticisme" name="Agnosticisme" value="0"
                    checked={this.state.TabReligion[0].value===1?true:false} onChange={this.handleChangeReligion} />

                  <label htmlFor="Athéisme">Athéisme</label>
                  <input type="checkbox" id="Athéisme" name="Athéisme" value="1"
                    checked={this.state.TabReligion[1].value===1?true:false} onChange={this.handleChangeReligion} />

                  <label htmlFor="Bouddhisme">Bouddhisme</label>
                  <input type="checkbox" id="Bouddhisme" name="Bouddhisme" value="2"
                    checked={this.state.TabReligion[2].value===1?true:false} onChange={this.handleChangeReligion} />

                  <label htmlFor="Christianisme">Christianisme</label>
                  <input type="checkbox" id="Christianisme" name="Christianisme" value="3"
                    checked={this.state.TabReligion[3].value===1?true:false} onChange={this.handleChangeReligion} />

                  <label htmlFor="Hindouisme">Hindouisme</label>
                  <input type="checkbox" id="Hindouisme" name="Hindouisme" value="4"
                    checked={this.state.TabReligion[4].value===1?true:false} onChange={this.handleChangeReligion} />
                  <label htmlFor="Jaïnisme">Jaïnisme</label>
                  <input type="checkbox" id="Jaïnisme" name="Jaïnisme" value="5"
                    checked={this.state.TabReligion[5].value===1?true:false} onChange={this.handleChangeReligion} />
                  <label htmlFor="Judaïsme">Judaïsme</label>
                  <input type="checkbox" id="Judaïsme" name="Judaïsme" value="6"
                    checked={this.state.TabReligion[6].value===1?true:false} onChange={this.handleChangeReligion} />
                  <label htmlFor="Islam">Islam</label>
                  <input type="checkbox" id="Islam" name="Islam" value="7"
                    checked={this.state.TabReligion[7].value===1?true:false} onChange={this.handleChangeReligion} />
                  <label htmlFor="Zoroastrisme">Zoroastrisme</label>
                  <input type="checkbox" id="Zoroastrisme" name="Zoroastrisme" value="8"
                    checked={this.state.TabReligion[8].value===1?true:false} onChange={this.handleChangeReligion} />

                  <label htmlFor="Sikhisme">Sikhisme</label>
                  <input type="checkbox" id="Sikhisme" name="Sikhisme" value="9"
                    checked={this.state.TabReligion[9].value===1?true:false} onChange={this.handleChangeReligion} />
                  <label htmlFor="Spiritualité">Spiritualité</label>
                  <input type="checkbox" id="Spiritualité" name="Spiritualité" value="10"
                    checked={this.state.TabReligion[10].value===1?true:false} onChange={this.handleChangeReligion} />
                  <label htmlFor="Autre">Autre</label>
                  <input type="checkbox" id="Autre" name="Autre" value="11"
                    checked={this.state.TabReligion[11].value===1?true:false} onChange={this.handleChangeReligion} />

                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutReligion()}>Fermer</button>
              </div>}
              {/* Filtre Astrologie */}
              {this.state.showFiltreAstrologie===false && <div className="col-xl"><label htmlFor="Astrologie"><i className="far fa-star"></i>Astrologie</label> <button className="btn-simple"
                  onClick={()=> this.handleClickInAstrologie()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreAstrologie===true && <div>
                <label htmlFor="Astrologie">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label htmlFor="Verseau">Verseau</label>
                  <input type="checkbox" id="Verseau" name="Verseau" value="0"
                    checked={this.state.TabAstrologie[0].value===1?true:false} onChange={this.handleChangeAstrologie} />

                  <label htmlFor="Poissons">Poissons</label>
                  <input type="checkbox" id="Poissons" name="Poissons" value="1"
                    checked={this.state.TabAstrologie[1].value===1?true:false} onChange={this.handleChangeAstrologie} />

                  <label htmlFor="Bélier">Bélier</label>
                  <input type="checkbox" id="Bélier" name="Bélier" value="2"
                    checked={this.state.TabAstrologie[2].value===1?true:false} onChange={this.handleChangeAstrologie} />

                  <label htmlFor="Taureau">Taureau</label>
                  <input type="checkbox" id="Taureau" name="Taureau" value="3"
                    checked={this.state.TabAstrologie[3].value===1?true:false} onChange={this.handleChangeAstrologie} />

                  <label htmlFor="Gémeaux">Gémeaux</label>
                  <input type="checkbox" id="Gémeaux" name="Gémeaux" value="4"
                    checked={this.state.TabAstrologie[4].value===1?true:false} onChange={this.handleChangeAstrologie} />
                  <label htmlFor="Cancer">Cancer</label>
                  <input type="checkbox" id="Cancer" name="Cancer" value="5"
                    checked={this.state.TabAstrologie[5].value===1?true:false} onChange={this.handleChangeAstrologie} />
                  <label htmlFor="Lion">Lion</label>
                  <input type="checkbox" id="Lion" name="Lion" value="6"
                    checked={this.state.TabAstrologie[6].value===1?true:false} onChange={this.handleChangeAstrologie} />
                  <label htmlFor="Vierge">Vierge</label>
                  <input type="checkbox" id="Vierge" name="Vierge" value="7"
                    checked={this.state.TabAstrologie[7].value===1?true:false} onChange={this.handleChangeAstrologie} />
                  <label htmlFor="Scorpion">Scorpion</label>
                  <input type="checkbox" id="Scorpion" name="Scorpion" value="8"
                    checked={this.state.TabAstrologie[8].value===1?true:false} onChange={this.handleChangeAstrologie} />

                  <label htmlFor="Sagittaire">Sagittaire</label>
                  <input type="checkbox" id="Sagittaire" name="Sagittaire" value="9"
                    checked={this.state.TabAstrologie[9].value===1?true:false} onChange={this.handleChangeAstrologie} />
                  <label htmlFor="Capricorne">Capricorne</label>
                  <input type="checkbox" id="Capricorne" name="Capricorne" value="10"
                    checked={this.state.TabAstrologie[10].value===1?true:false} onChange={this.handleChangeAstrologie} />
                  <label htmlFor="Balance">Balance</label>
                  <input type="checkbox" id="Balance" name="Balance" value="11"
                    checked={this.state.TabAstrologie[11].value===1?true:false} onChange={this.handleChangeAstrologie} />

                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutAstrologie()}>Fermer</button>
              </div>}
              {/* Filtre Animaux */}
              {this.state.showFiltreAnimaux===false && <div className="col-xl"><label htmlFor="Animaux"><i className="fas fa-paw"></i>Animaux</label> <button className="btn-simple" onClick={()=>
                  this.handleClickInAnimaux()}>Ajouter ce filtre</button></div>}
              {this.state.showFiltreAnimaux===true && <div>
                <label htmlFor="Animaux">Vous ne verrez plus les profils ayant les préférences décochés</label>
                <div className="space-label space-input">
                  <label htmlFor="Chiens">Chiens</label>
                  <input type="checkbox" id="Chiens" name="Chiens" value="0"
                    checked={this.state.TabAnimaux[0].value===1?true:false} onChange={this.handleChangeAnimaux} />

                  <label htmlFor="Chats">Chats</label>
                  <input type="checkbox" id="Chats" name="Chats" value="1"
                    checked={this.state.TabAnimaux[1].value===1?true:false} onChange={this.handleChangeAnimaux} />

                  <label htmlFor="Beaucoup">Beaucoup</label>
                  <input type="checkbox" id="Beaucoup" name="Beaucoup" value="2"
                    checked={this.state.TabAnimaux[2].value===1?true:false} onChange={this.handleChangeAnimaux} />

                  <label htmlFor="Autres">Autres</label>
                  <input type="checkbox" id="Autres" name="Autres" value="3"
                    checked={this.state.TabAnimaux[3].value===1?true:false} onChange={this.handleChangeAnimaux} />

                  <label htmlFor="Aucun">Aucun</label>
                  <input type="checkbox" id="Aucun" name="Aucun" value="4"
                    checked={this.state.TabAnimaux[4].value===1?true:false} onChange={this.handleChangeAnimaux} />
                  <label htmlFor="Allergique">Allergique</label>
                  <input type="checkbox" id="Allergique" name="Allergique" value="5"
                    checked={this.state.TabAnimaux[5].value===1?true:false} onChange={this.handleChangeAnimaux} />

                </div>
                <button className="btn-simple" onClick={()=> this.handleClickOutAnimaux()}>Fermer</button>
              </div>}

              {/*--------------------------Radio button-------------------------- */}
              <div className="width90 align-card-tel input-group input_group_text">
                <div className="input-group-prepend vertical-align">
                  <label className="input_group_text " htmlFor="Filtre Actif">Filtre Actif :</label>
                </div>
                <div className="col-lg form-check form-check-inline space-label space-input">
                  <label className="form-check-label" htmlFor="EtudesActif"><i className="fas fa-user-graduate"></i>Etudes</label>
                  <input className="form-check-input" type="radio" name="EtudesActif" id="EtudesActif" value="Etudes"
                    checked={this.state.Actif==='Etudes' } onChange={this.handleChangeActif} />
                </div>
                <div className="col-lg form-check form-check-inline">
                  <label className="form-check-label" htmlFor="SportActif"><i className="fas fa-dumbbell"></i>Activités Physique</label>
                  <input className="form-check-input" type="radio" name="SportActif" id="SportActif"
                    value="Activités Physique" checked={this.state.Actif==='Activités Physique' }
                    onChange={this.handleChangeActif} />
                </div>
                <div className="col-lg form-check form-check-inline">
                  <label className="form-check-label" htmlFor="YeuxActif"><i className="far fa-eye"></i>Yeux</label>
                  <input className="form-check-input" type="radio" name="YeuxActif" id="YeuxActif" value="Yeux"
                    checked={this.state.Actif==='Yeux' } onChange={this.handleChangeActif} />
                </div>
                <div className="col-lg form-check form-check-inline">
                  <label className="form-check-label" htmlFor="CheveuxActif"><i className="fas fa-cut"></i>Cheveux</label>
                  <input className="form-check-input" type="radio" name="CheveuxActif" id="CheveuxActif" value="Cheveux"
                    checked={this.state.Actif==='Cheveux' } onChange={this.handleChangeActif} />
                </div>
                <div className="col-lg form-check form-check-inline">
                  <label className="form-check-label" htmlFor="AlcoolActif"><i className="fas fa-cocktail"></i>Alcool</label>
                  <input className="form-check-input" type="radio" name="AlcoolActif" id="AlcoolActif" value="Alcool"
                    checked={this.state.Actif==='Alcool' } onChange={this.handleChangeActif} />
                </div>
                <div className="col-lg form-check form-check-inline">
                  <label className="form-check-label" htmlFor="TabacActif"><i className="fas fa-smoking"></i>Tabac</label>
                  <input className="form-check-input" type="radio" name="TabacActif" id="TabacActif" value="Tabac"
                    checked={this.state.Actif==='Tabac' } onChange={this.handleChangeActif} />
                </div>
                <div className="col-lg form-check form-check-inline">
                  <label className="form-check-label" htmlFor="ReligionActif"><i className="fas fa-church"></i>Religion</label>
                  <input className="form-check-input" type="radio" name="ReligionActif" id="ReligionActif"
                    value="Religion" checked={this.state.Actif==='Religion' } onChange={this.handleChangeActif} />
                </div>
                <div className="col-lg form-check form-check-inline">
                  <label className="form-check-label" htmlFor="AstrologieActif"><i className="far fa-star"></i>Astrologie</label>
                  <input className="form-check-input" type="radio" name="AstrologieActif" id="AstrologieActif"
                    value="Astrologie" checked={this.state.Actif==='Astrologie' } onChange={this.handleChangeActif} />
                </div>
                <div className="col-lg form-check form-check-inline">
                  <label className="form-check-label" htmlFor="AnimauxActif"><i className="fas fa-paw"></i>Animaux</label>
                  <input className="form-check-input" type="radio" name="AnimauxActif" id="AnimauxActif" value="Animaux"
                    checked={this.state.Actif==='Animaux' } onChange={this.handleChangeActif} />
                </div>
              </div>
              <br />
              {/*--------------------------SAVE-------------------------- */}
              <br />
              <button className="btn-simple" type="submit">Sauvegarder</button>
              <br/>
              <br/>
              <button className="btn-simple" onClick={()=> this.resetTab()}>Annuler les filtres</button>
            </form>
          </div>
          
          
        </div>
          );
    }
}

export default Filtre;
