import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Pubsub from 'pubsub-js';
import Progress from './Progress';
import '../style/Player.css';
/* global $ */
export default class Player extends Component{
	constructor(props){
		super(props);
		this.state={
			progress:0,
			volume:0,
			duration:0,
			leftTime:'0:00'
		};
	}
	componentDidMount(){
		$('#player').bind($.jPlayer.event.timeupdate,e=>{
			this.setState({
				progress:e.jPlayer.status.currentPercentAbsolute,
				volume:e.jPlayer.options.volume*100,
				duration:e.jPlayer.status.duration,
				leftTime:this.formatTime(this.state.duration*(1-e.jPlayer.status.currentPercentAbsolute/100))
			});
		});
	}
	componentWillUnmount(){
		$('#player').unbind($.jPlayer.event.timeupdate);
	}
	setNewProgress(newProgress){
		$('#player').jPlayer('play',this.state.duration*newProgress);
		Pubsub.publish('PLAYING');
	}
	setNewVolume(newProgress){
		$('#player').jPlayer('volume',newProgress);
	}
	playPrev(){
		Pubsub.publish('PLAY_PREV');
	}
	playNext(){
		Pubsub.publish('PLAY_NEXT');
	}
	playPause(){
		Pubsub.publish('PLAY_PAUSE');
	}
	changMode(){
		Pubsub.publish('CHANGE_MODE');
	}
	formatTime(time){
		time=Math.floor(time);
		let minutes=Math.floor(time/60);
		let seconds=Math.floor(time%60);
		seconds=seconds<10?`0${seconds}`:seconds;
		return `${minutes}:${seconds}`;
	}
	render(){
		return(
			<div className="player-page">
                <h1 className="caption"><Link to="/list">Music List &gt;</Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusic.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusic.artist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
                					<Progress
									progress={this.state.volume}
									onProgressChange={this.setNewVolume}
									barColor='#2f9842'
				                	></Progress>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px',marginTop:20}}>
                			<Progress
								progress={this.state.progress}
								onProgressChange={this.setNewProgress.bind(this)}
								barColor="#2f9842"
			                ></Progress>
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev"
	                				onClick={this.playPrev}
	                			></i>
	                			<i className={`icon ml20 ${this.props.playing?'pause':'play'}`}
	                			   	onClick={this.playPause}
	                			></i>
	                			<i className="icon ml20 next"
	                				onClick={this.playNext}
	                			></i>
                			</div>
                			<div className="-col-auto">
                				<i 
                				className={`icon ${this.props.mode==='inOrder'? 'repeat-cycle':(this.props.mode==='random'? 'repeat-random':'repeat-once')}`}
                					onClick={this.changMode}
                				></i>
                			</div>
                		</div>
                	</div>
                	<div className={`-col-auto cover ${this.props.playing? 'rotate':''}`}>
                		<img src={this.props.currentMusic.cover} alt={this.props.currentMusic.title}/>
                	</div>
                </div>
            </div>
		);
	}
}