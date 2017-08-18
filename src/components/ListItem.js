import React,{Component} from 'react';
import Pubsub from 'pubsub-js'
import '../style/ListItem.css'

export default class ListItem extends Component{
	constructor(props){
		super(props);
	}
	playMusic(listItem){
		Pubsub.publish('PLAY_MUSIC',listItem);
	}
	deleteMusic(listItem,e){
		e.stopPropagation();
		Pubsub.publish('DELETE_MUSIC',listItem);
	}
	render(){
		let listItem=this.props.listItem;
		return(
			<li className={`components-listItem row ${this.props.focus?'focus':''}`} 
			    onClick={this.playMusic.bind(this,listItem)} >
			    <p><strong>{listItem.title}</strong>-{listItem.artist}</p>
			    <p className="-col-auto delete"
			        onClick={this.deleteMusic.bind(this,listItem)}></p>
			</li>
		);
	}
}