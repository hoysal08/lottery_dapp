import "./App.css";
import React from "react";
import web3 from './web3.js'
import lottery from "./lottery"

 
class App extends React.Component {
  
    state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: '',
      lastwin:' '
    };
  
    async componentDidMount() {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      const lastwin=await lottery.methods.getWinner().call();
      this.setState({ manager, players, balance });
    }
   
  
    onSubmit = async event => {
      event.preventDefault();
  
      const accounts = await web3.eth.getAccounts();
  
      this.setState({ message: 'Waiting on transaction success...' });
  
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });
  
      this.setState({ message: 'You have been entered!' });
    };
  
    onClick = async () => {
      const accounts = await web3.eth.getAccounts();
  
      this.setState({ message: 'Waiting on transaction success...' });
  
      await lottery.methods.pickwinnder().send({
        from: accounts[0]
      });
  
      this.setState({ message: 'A winner has been picked!' });
    };
  
    render() {
      
   console.log( this.state.lastwin)
      return (
        
        <div>
          <h2>Lottery Contract</h2>
          <p>
            This contract is managed by {this.state.manager}. There are currently{' '}
            {this.state.players.length} people entered, competing to win{' '}
            {web3.utils.fromWei(this.state.balance, 'ether')} ether!
          </p>
  
          <hr />
  
          <form onSubmit={this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of ether to enter</label>
              <input
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
              />
            </div>
            <button>Enter</button>
          </form>
  
          <hr />
  
          <h4>Ready to pick a winner?</h4>
          <button onClick={this.onClick}>Pick a winner!</button>
          
          <hr/>
          <h4>The winner of the last round of lottery was:</h4>
          <p>{this.state.lastwin}</p>
          <hr />
  
          <h1>{this.state.message}</h1>
        </div>
      );
    }
  }
export default App;