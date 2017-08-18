import React, { Component } from 'react';
import Pubsub from 'pubsub-js';
import { BrowserRouter as Router,Route} from 'react-router-dom'
import {MUSIC_LIST} from '../musicList'
import Player from './Player';
import List from './List'
import logo from '../logo.svg';
import '../styles/App.css';
import '../index'
/* global $ */
export default class App extends Component {
  constructor(){
    super();
    this.state={
      musicList:MUSIC_LIST,
      currentMusic:MUSIC_LIST[0],
      mode:'inOrder',
      playing:false
    }
  }
  componentDidMount(){
    $('#player').jPlayer({
      supplied:'mp3',
      wmode:'window'
    }).jPlayer('setMedia',{
      mp3:this.state.currentMusic.file
    });
    if(this.state.playing) this.playMusic(this.state.currentMusic); 
    $('#player').bind($.jPlayer.event.ended,e=>{
      this.playNext();
      if(this.state.mode==='singleCycle') this.playNext('prev');
    });
    Pubsub.subscribe('PLAY_PREV',()=>{
      this.playNext('prev');
      this.setState({
        playing:true
      });
    });
    Pubsub.subscribe('PLAY_NEXT',()=>{
      this.playNext();
      this.setState({
        playing:true
      });
    });
    Pubsub.subscribe('PLAY_PAUSE',()=>{
      if(this.state.playing) $('#player').jPlayer('pause');
      else $('#player').jPlayer('play');
      this.setState(prevState=>({
        playing:!prevState.playing
      }));
    });
    Pubsub.subscribe('PLAYING',()=>{
      this.setState({
        playing:true
      });
    });
    Pubsub.subscribe('PLAY_MUSIC',(msg,listItem)=>{
      this.playMusic(listItem);
      this.setState({
        playing:true
      });
    });
    Pubsub.subscribe('DELETE_MUSIC',(msg,listItem)=>{
      this.setState({
        musicList:this.state.musicList.filter(item=>{
          return item!==listItem;
        })
      });
    });
    Pubsub.subscribe('CHANGE_MODE',()=>{
      this.changMode(['inOrder','random','singleCycle']);
    })
  }
  componentWillUnmount(){
    Pubsub.unsubscribe('PLAY_PREV');
    Pubsub.unsubscribe('PLAY_NEXT');
    Pubsub.unsubscribe('PLAY_PAUSE');
    Pubsub.unsubscribe('PLAYING');
    Pubsub.unsubscribe('PLAY_MUSIC');
    Pubsub.unsubscribe('DELETE_MUSIC');
    Pubsub.unsubscribe('CHANGE_MODE');
    $('#player').unbind($.jPlayer.event.ended);
  }
  playMusic(listItem){
    $('#player').jPlayer('setMedia',{
      mp3:listItem.file
    }).jPlayer('play');
    this.setState({
      currentMusic:listItem
    });
  }
  playNext(type='next'){
    let newIndex=this.newIndex(this.state.musicList,this.state.currentMusic,type);
    this.playMusic(this.state.musicList[newIndex]);
  }
  changMode(modeList){
    let newIndex=this.newIndex(modeList,this.state.mode,'next');
    this.setState({
      mode:modeList[newIndex]
    });
    let currentMode=this.state.mode;
    if(currentMode==='inOrder'){
      this.setState({
        musicList:MUSIC_LIST
      });
    }else if(currentMode==='random'){
      let musicList=MUSIC_LIST.slice(0);
      let randomList = [];
      for (let i = 0, len = musicList.length; i < len; i++) {
        let j = Math.floor(Math.random() * musicList.length);
        randomList[i] = musicList[j];
        musicList.splice(j, 1);
      }
      this.setState({
        musicList:randomList
      });
    }
  }
  newIndex(list,currentItem,type){
    let index=list.indexOf(currentItem);
    let newIndex=null;
    let length=list.length;
    if(type==='next') newIndex=(index+1)%length;
    else newIndex=(index-1+length)%length;
    return newIndex
  }
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header row">
            <img src={logo} className={`App-logo -col-auto ${this.state.playing? '':'rotate'}`} alt="logo" />
            <h1 className="App-name -col-auto">React Music Player</h1>
          </div>
          <Route exact
            path="/" 
            render={()=><Player
              currentMusic={this.state.currentMusic}
              mode={this.state.mode}
              playing={this.state.playing}
            />}
          ></Route>
          <Route exact
            path="/list" 
            render={()=><List
              currentMusic={this.state.currentMusic}
              musicList={this.state.musicList}
            />}
          ></Route>
        </div>
      </Router>
    );
  }
}