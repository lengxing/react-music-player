import React,{Component} from 'react';
import ListItem from './ListItem'

export default class List extends Component{
	constructor(props){
		super(props);
	}
	render(){
		let items=this.props.musicList.map((item)=>{
			return (
				<ListItem 
					key={item.id}
					listItem={item}
					focus={item===this.props.currentMusic}
				></ListItem>
			);
		});
		return(
			<ul>{items}</ul>
		);
	}
}