import React, { Component } from 'react';
import './Contact.css';
import WilliamContact from '../images/WilliamContact.jpg';
import TheoContact from '../images/TheoContact.jpg';
import FlorentContact from '../images/FlorentContact.png';
import JulienContact from '../images/JulienContact.jpg';


/**
 * Class qui s'occupe de la page Contact
 */
class Contact extends Component{
    constructor(props) {
        super(props);
      }

    /**
     * Rendu du component
     */
    render(){
      return(
        <div className="Contact">
          <br />
          <br />
          <br />
          <br />
          <span className="title-Contact">Nous contacter</span>
          <div className="container-fluid">
            {/* Théo */}
            <div className="row presentation">
              <div className="col-lg-2">
                <img className="align-img rounded-circle" src={TheoContact} alt="Theo" width="140" height="140"/>
              </div>
              <div className="description-Contact col-lg">
                  <span className="titre-Contact">THEO JULIEN</span><br />
                  <span className="titre-Contact">étudiant de seconde année de cycle
                  préparatoire</span><br />
                  Developpeur Chef <br />
                  <b><a href="mailto:theo.julien@eisti.fr"><i className="fas fa-address-card"></i>  Email</a></b>
              </div>
              
            </div>

            {/* William */}
            <div className="row presentation">
              <div className="col-lg-2">
                <img className="align-img rounded-circle" src={WilliamContact} alt="William" width="140" height="140"/>
              </div>
              <div className="description-Contact col-lg">
                <span className="titre-Contact">WILLIAM KACZMAREK</span><br />
                  <span className="titre-Contact">étudiant de seconde année de cycle
                  préparatoire</span><br />
                Developpeur Profil<br />
                <b><a href="mailto:william.kaczmarek@eisti.fr"><i className="fas fa-address-card"></i>  Email</a></b>
              </div>
              
            </div>

            {/* Florent*/}
            <div className="row presentation">
              <div className="col-lg-2">
                <img className="align-img rounded-circle" src={FlorentContact} alt="Florent" width="140" height="140"/>
              </div>
              <div className="description-Contact  col-lg">
                <span className="titre-Contact">FLORENT BEDNAREK</span><br />
                <span className="titre-Contact">étudiant de seconde année de cycle
                  préparatoire</span><br />
                Developpeur Messagerie <br />
                <b><a href="mailto:florent.bednarek@eisti.fr"><i className="fas fa-address-card"></i>  Email</a></b>
              </div>
            </div>
            
            {/* Julien */}
            <div className="row presentation">
              <div className="col-lg-2">
                <img className="align-img rounded-circle" src={JulienContact} alt="Julien" width="140" height="140"/>
              </div>
              <div className="description-Contact col-lg">
                <span className="titre-Contact">JULIEN RICHARD</span>
                <br />
                <span className="titre-Contact">étudiant de seconde année de cycle
                  préparatoire</span><br />
                Designer 
                <br />
                <b><a href="mailto:richardjul@eisti.fr"><i className="fas fa-address-card"></i>  Email</a></b>
              </div>
          </div>
          </div>
        </div>
      );
    }
}

export default Contact;