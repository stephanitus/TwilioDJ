import React, { Component } from 'react';
import './feedqueue.css';

class SongQueue extends Component{
  constructor(props){
    super(props);
    this.state = {
      spotifyApi: this.props.spotifyApi,
      trackNames: [],
      trackURIs: []
    };
    this.scrubMessages = this.scrubMessages.bind(this);
    this.getTrackURIs = this.getTrackURIs.bind(this);
    setInterval(this.scrubMessages, 5000);
    setInterval(this.props.mergeState, 5000, {trackURIs: this.state.trackURIs});
  }

  //Search spotify for matching song
scrubMessages(){
    this.setState({...this.props.getState()});

    var trackNames = (this.state.messages.map(async (input) => {
      return(
        this.state.spotifyApi.searchTracks(`track:${input.body}`)
        .then(data => {
          if(data.body.tracks.items[0]){
            return (data.body.tracks.items[0].name + " - " + data.body.tracks.items[0].artists[0].name);
          }else{
            return "Invalid Song";
          }
        }, err => {}
      ))
      })
    );
    Promise.all(trackNames).then((completed) => this.setState({trackNames: this.sortByPopularity(completed)}));
    this.getTrackURIs();
  }

  getTrackURIs(){
      var trackURIs = (this.state.messages.map(async (track) => {
        return(
          this.state.spotifyApi.searchTracks('track:'+track)
          .then(data => {
            if(data.body.tracks.items[0]){
              return data.body.tracks.items[0].uri;
            }else{
              return "Invalid Song";
            }
          }, err => {}
        ))
      })
    );
    Promise.all(trackURIs).then((completed) => this.setState({trackURIs: this.sortByPopularity(completed)}));
  }

  sortByPopularity(array){
    var count = {};
    array.forEach(uri => count[uri] = (count[uri] || 0) + 1);

    count = Object.entries(count);

    count.sort((a,b) => {
    	if (a[1] > b[1]) return -1;
      if (a[1] < b[1]) return 1;
      return 0;
    });
    return count;
  }

  render(){
    return(
      <span className="container right">
        <h3>Up Next</h3>
        <ul>
          {(this.state.trackNames.length === 0 || (this.state.trackNames.length === 1 && this.state.trackNames[0][0] === "Invalid Song")) &&
            <li style={{textAlign: 'center'}}>Waiting for your votes!</li>
          }
          {this.state.trackNames.length > 0 && this.state.trackNames.map((row) =>
            <li key={row[0]}>
              {row[0]}
            </li>)
          }
        </ul>
      </span>
    )
  }
}


export default SongQueue;
