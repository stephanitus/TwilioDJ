import React, { Component } from 'react';
import Moment from 'moment';
import './feedqueue.css';


class ActivityFeed extends Component{
  constructor(props){
    super(props);
    this.state = {
      messages: this.props.messages
    };
  }

  render(){
    return(
      <span className="container left">
        <h3>Activity Feed</h3>
        <ul>
          {this.state.messages.length === 0 &&
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
