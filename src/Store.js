//Store for messages
class Store{
  constructor(initialState = {}){
    this.state = initialState;
  }

  mergeState(partialState){
    Object.assign(this.state, partialState);
  }

  getState(){
    return this.state;
  };
}

export default Store;
