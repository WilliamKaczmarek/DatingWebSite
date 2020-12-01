import React, { Component } from 'react';
import './About.css';
import '../App.css';
import WilliamAbout from '../images/WilliamAbout.jpg';
import TheoAbout from '../images/TheoAbout.jpg';
import FlorentAbout from '../images/FlorentAbout.png';
import JulienAbout from '../images/JulienAbout.jpg';

/**
 * Class qui s'occupe de la page About
 */
class About extends Component{
    constructor(props) {
        super(props);
      }

    /**
     * Rendu du component
     */
    render(){
      return(
      <div className="About container-fluid">
        <br />
        <br />
        <br />
        <div className="row">
          <div className="col-sm">
            <span className="title-About">A propos de nous</span>
          </div>
        </div>
        <br />
        <br />
        <br />

        <div className="row">
          <div className="col-md">
            <div className="box-About">
              {/* Pour Théo */}
              <div className="card-About">
                <div className="imgBx-About">
                  <img src={TheoAbout} alt="Theo About" />
                </div>
                <div className="details-About">
                  <h2>Théo Julien
                    <br />
                    <span>Développeur Chef</span>
                    <span className="description">Un vrai crack ce petit fou
                      va coder jusqu'à 5h du matin s'il le faut. La légende raconte qu'il travaille déjà pour google et que
                      l'EISTI n'est qu'une couverture pour ne pas payer d'impôt sur son salaire à 9 chiffres.
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md">
            <div className="box-About">
              {/* Pour Willik */}
              <div className="card-About">
                <div className="imgBx-About">
                  <img src={WilliamAbout} alt="William About" />
                </div>
                <div className="details-About">
                  <h2>William Kaczmarek
                    <br />
                    <span>Developpeur profil</span>
                    <span className="description">Toujours au garde à vous, il est le jeune disciple et
                      coach sportif du déveloper chef. Il est très éfficace quand il n'est pas alcoolisé ou en
                      peine de coeur.
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

          <br />
          <br />
        <div className="row">
          <div className="col-md">
            <div className="box-About">
              {/* Pour Florent */}
              <div className="card-About">
                <div className="imgBx-About">
                  <img src={FlorentAbout} alt="Florent About"/>
                </div>
                <div className="details-About">
                  <h2>Florent Bednarek
                    <br />
                    <span>Développeur messagerie</span>
                    <span className="description">Un jeune loup
                        solitaire, on ne sait pas trop quand il travaille mais des dingueries apparaissent de temps en temps.
                        Cet enfant pourrait même égaler les plus grands s'il ne se couchait pas à 20h30.
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md">
            <div className="box-About">
              {/* Pour Julien */}
              <div className="card-About">
                <div className="imgBx-About">
                  <img src={JulienAbout} alt="Julien About"/>
                </div>
                <div className="details-About">
                  <h2>Julien Richard
                    <br />
                    <span>Designer</span>
                    <span className="description">Le plus bruillant du groupe. Ce jeune Twittos se couche à des horaires improbables. 
                    Il est aussi la cible préférée du petit soldat, même si ce dernier sait qu'il ne fait pas le poids.
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>

      );
    }
}

export default About;