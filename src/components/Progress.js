import React,{Component} from 'react';
import '../styles/Progress.css'

export default class Progress extends Component{
	constructor(props){
    	super(props);
    }
	changeProgress(e){
		let progressBar=this.refs.progressBar;
		let newProgress=(e.clientX-progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
		this.props.onProgressChange && this.props.onProgressChange(newProgress);
	}
	render(){
		return(
			<div className="components-progress" ref="progressBar" onClick={this.changeProgress.bind(this)}>
				<div className="progress" style={{width:`${this.props.progress}%`,background:this.props.barColor}}></div>
			</div>
		);
	}
}