import React, { Component } from 'react';
import './feedqueue.css';

class SongQueue extends Component{
  constructor(props){
    super(props);
    this.state = {
      trackNames: this.props.trackNames
    };
  }

  componentDidUpdate(prevProps){
    if(this.props.trackNames !== prevProps.trackNames){
      this.setState({trackNames: this.props.trackNames});
    }
  }

  render(){
    return(
      <span className="container right">
        <h3>Up Next</h3>
        <ul>
          {(this.state.trackNames.length === 0 || (this.state.trackNames.length === 1 && this.state.trackNames[0][0] !== "Invalid Song")) &&
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
