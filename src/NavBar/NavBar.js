import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import logo from './images/logo.png';

/**
 * Class qui s'occupe de la bar de navigation en haut du site
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  /**
   * Menu hamburger pour les téléphones
   */
  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  /**
   * Rendu de la navbar
   */
  render() {
    const collapsed = this.state.collapsed;
    const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
    const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
    return (
    <nav className = "navbar navbar-expand-md bg-grad navbar-dark fixed-top">
    <div className="container">
    <Link to="/" className="navbar-brand">
    	<img src={logo} alt="logo" width="40px" height="40px"/>
    </Link>
      <button  onClick={this.toggleNavbar} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`${classOne}`} id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            
            <li className="nav-item active">
              <Link className="collapsed nav-link" to="/">Home </Link>
            </li>
            
            <li className="nav-item active">
              <Link className="nav-link" to="/abonnement">Abonnement </Link>
            </li>

            <li className="nav-item active">
              <Link className="nav-link" to="/about">About </Link>
            </li>
            
            <li className="nav-item active">
              <Link className="nav-link" to="/contact">Contact </Link>
            </li>

          </ul>
        </div>
    </div>
  </nav>
    );
  }
}
export default NavBar;

