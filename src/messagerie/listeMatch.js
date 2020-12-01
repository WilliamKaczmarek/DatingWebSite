import React, { Component } from 'react';
import Cookies from 'js-cookie';

import {URL_API} from '../App';
import ListMessages from './message'


class ListMatch extends Component {
	constructor(props) {
        super(props);
        
        this.state = {
        		list : "",
        		show : 0,
        		id : 0,
        		id2: 0,
        		match : "",
        		prenom:"",
        }
        this.handleChildUnmount = this.handleChildUnmount.bind(this);

    }

     handleChildUnmount(){
        this.setState({show: 0});
    }

	prenom(id){
		const axios = require('axios');  //Requêtes HTTP
        let formdata = new FormData();
        formdata.append('id',id);
		const url = URL_API+'prenom.php';
        axios.post(url,formdata)
        .then(res => {
        	this.setState( {prenom: this.state.prenom + id + "-" + res.data + ';'});
        	
        })
        .catch(err => {
            console.log(err);
        });
	}

	loadMyMatch(){
		const axios = require('axios');  //Requêtes HTTP
		let config = {
            headers: {
            logginid: Cookies.get("ID")
            }
        }
        let formdata = new FormData();
		const url = URL_API+'nbrMatch.php';
        axios.post(url,formdata,config)
        .then(res => {
        	this.setState({list : res.data});
        	let match = res.data;
			match = match.slice(0,-1);
			let lmatch = match.split(';');
			lmatch.forEach(el => {if(el.split('-')[0] == Cookies.get('ID')){ this.prenom(el.split('-')[1]) } else { this.prenom(el.split('-')[0])}})
        })
        
        .catch(err => {
            console.log(err);
        });
	}

	handleClick(id,id2){
		this.setState({show : 1});
		this.setState({id : id});
		this.setState({id2 : id2})
	}

	index(id,id2){
		let l = this.state.prenom;
		l = l.slice(0,-1);
		let li = l.split(';');
		return li.map(el => {if(id == el.split('-')[0] || id2 == el.split('-')[0]){ return el.split('-')[1] }});
	}

	delete(id,id2){
		const axios	= require('axios');
		let formdata = new FormData();
		formdata.append('id',id);
		formdata.append('id2',id2);
		const url = URL_API + 'DeleteMatch.php';
		axios.post(url,formdata)
		.then(res => {
		})
		.catch(err => {
			console.log(err);
		})
	}

	affMatch() {		
		let ret = "";
		let match = this.state.list;
		match = match.slice(0,-1);
		let lmatch = match.split(';');
		ret = lmatch.map(el => 	<div className="lmatch">
									<div  className="nomMatch" onClick={ () => {this.handleClick(el.split('-')[0],el.split('-')[1])}}>
										<strong>{this.index(el.split('-')[0],el.split('-')[1])}</strong>
									</div>
									<div className="deleteMatch" onClick={() => {this.delete(el.split('-')[0],el.split('-')[1])}}>
										Supprimer/Bloquer ce match
									</div>
								</div>);
		this.setState({match:ret});
	}


	


	componentDidMount() {
		this.loadMyMatch()
		setTimeout(() => this.affMatch(),1000)
	}  	


	render(){
		return(
			<div className="mesmatch">
				<h2> Mes Match </h2>

				<div className="listeMatch">
				{this.state.match}
				</div>
				{this.state.show === 1 &&
					<ListMessages id={this.state.id} id2={this.state.id2} unmountMe={this.handleChildUnmount}/>
				}
				
			</div>
		)
	}
}

export default ListMatch;