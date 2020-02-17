import React, { Component } from 'react';
import Moment from 'moment';
import './feedqueue.css';


class ActivityFeed extends Component{
  constructor(props){
    super(props);
    this.state = {
      ...this.props.getState(),
      spotifyApi: this.props.spotifyApi
    };
    this.updateMessages = this.updateMessages.bind(this);
    this.updateMessages(.25);
    setInterval(this.updateMessages, 10000, .25);
  }

  updateMessages(daysOld){
    fetch(`/api/messages?days=${daysOld}`, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      if(data.length > 0){
        this.setState({messages: data.concat(this.state.messages), empty: false});
        this.props.mergeState(this.state);
      }
    });
    fetch('api/messages', { method: 'DELETE' })
    .then(res => res.json());
  }

  render(){
    return(
      <span className="container left">
        <h3>Activity Feed</h3>
        <ul>
          {this.state.empty &&
            <li style={{textAlign: 'center'}}>Nothing yet! Request a song by texting the name to <br/><b>(201)509-4954</b>!</li>
          }
          {this.state.messages.map((m) =>
            <li key={m.sid}>
              Anonymous requested {m.body}<br/>
              {Moment(new Date(m.dateSent)).fromNow()}
            </li>)
          }
        </ul>
      </span>
    )
  }
}


export default ActivityFeed;
