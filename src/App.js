import React, {Component} from 'react';
import './App.css';
import Titlebar from './Titlebar';
import ActivityFeed from './ActivityFeed';
import SongQueue from './SongQueue';
import Store from './Store'
import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyPlayer from 'react-spotify-web-playback';

class App extends Component{
  constructor(props){
    super(props);
    const params = this.getHashParams();
    const accessToken = params.access_token;
    const refreshToken= params.refresh_token;
    this.state = {
      loggedin: accessToken ? true : false,
      spotifyApi: new SpotifyWebApi(),
      messages: [],
      trackURIs: [],
      empty: false
    };
    if(accessToken){
      this.state.spotifyApi.setAccessToken(accessToken);
      this.state.spotifyApi.setRefreshToken(refreshToken);
    }
  }

  mergeState(partialState){
    Object.assign(this.state, partialState);
  }

  getState(){
    return this.state;
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  render(){
    if(this.state.loggedin){
      return (
      <div className="App">
        <Titlebar />
          <div className="bgarea">
            <ActivityFeed spotifyApi={this.state.spotifyApi} mergeState={this.state.messageStormergeState.bind(this.state.messageStore)} getState={this.state.messageStore.getState.bind(this.state.messageStore)}/>
            <SongQueue spotifyApi={this.state.spotifyApi} mergeState={this.state.messageStore.mergeState.bind(this.state.messageStore)} getState={this.state.messageStore.getState.bind(this.state.messageStore)}/>
            <div className="playbackContainer">
              <SpotifyPlayer
                styles={{
                  color: 'white',
                  bgColor: 'rgba(0,0,0,.6)'
                }}
                token={this.state.spotifyApi.getAccessToken()}
                uris={[this.state.messageStore.getState().trackURIs]}
              />
            </div>
          </div>
      </div>
      );
    }else{
      return (
        <div className="App">
          <Titlebar />
          <div className="bgarea">
            <div className="login">
              <h1>Please log in with Spotify to use this service!</h1>
              <a href='http://localhost:3001/login'>Login to Spotify</a>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default App;
