import React, { Component } from 'react';
import './feedqueue.css';


class ActivityFeed extends Component{
  constructor(props){
    super(props);
    this.state = {
      messages: this.props.messages
    };
  }

  componentDidUpdate(prevProps){
    if(this.props.messages !== prevProps.messages){
      this.setState({messages: this.props.messages});
    }
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
            <li key={m}>
              Anonymous requested {m}<br/>
            </li>)
          }
        </ul>
      </span>
    )
  }
}


export default ActivityFeed;
