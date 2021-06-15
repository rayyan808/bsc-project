import './assets/css/Login-Form-Dark.css';
import './assets/css/styles.css';
import {Component} from 'react';
import {useRoutes} from './routes';
import { BrowserRouter, Link, Switch, Route, Router} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import Select from 'react-select';
import VoteKeyGeneratorForm from './components/VoteKeyGeneratorForm';
//import {useState, setState} from 'react';
import {Election, Accounts, web3, iniAccounts} from './components/web3_utility';
import {iniZokrates, zkProvider} from './components/zkProvider';
const Abi = require ('./assets/contracts/electionAbi.json');
//const { initialize } = require('zokrates-js');
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        electionName: "John Doe",
        candidateA: "john.doe@test.com",
        candidateB: "",
        account: null,
        accountSelected: false,
        accountList: [],
        accountLabels: [{}]
      };
      this.handleChange = this.handleChange.bind(this);
      this.conductElection = this.conductElection.bind(this);
      //this.useRoutes = this.useRoutes.bind(this);
      iniAccounts();
    iniZokrates();
    }
  async iniDApp() 
  {
    /*try {
      Accounts = await web3.eth.getAccounts();
     } catch(err){
       console.log("Error initializing Accounts");
     }
     try {
       console.log(ElectionAbi);
      Election = new web3.eth.Contract(Abi,ELECTION_ADDRESS);
      console.log(Election.methods);
     // Election = await eContract.at(ELECTION_ADDRESS/*  , 'hex address of contract');
     } catch(err){
       console.log("Error initializing Election Contract :" + err);
     } */
    //iniZokrates();
  }  
// 
   handleChange = (e) => {
    const val  = e.target.value;
    this.setState({
      [e.target.name]: val
    });
    console.log('State: ' + e.target.name + ' Value:' + val);
    };
   conductElection = async (e) => {
    e.preventDefault();
    //await this.iniDApp();
    console.log("Sending request to Blockchain network \n");
    console.log("Account initialized: " + Accounts[0]);
    console.log(this.state.electionName +  "\n");
    
    await Election.methods
      .conductElection(this.state.electionName, 3, this.state.candidateA, this.state.candidateB)
      .send({ from: Accounts[this.state.account], gas: 400000 });
   
      console.log("End of Conduct \n");
  }
     /* =========================================== ACCOUNT MANAGEMENT ==================================================================== */
   /* Click button 'Get Accounts' => Async retrieve accounts via web3 utility*/
   getAccounts = async (e) => {
    if( e !== undefined) {e.preventDefault();}
    if(!this.state.accountLoaded){
   console.log("Retrieving Accounts from Blockchain.");
   iniAccounts().then((acc) => { 
     this.setState({accountList : Accounts});
     this.setState({accountLoaded: true});
     var labels = new Array();
     for(var i =0; i < Accounts.length; i++){
       var x = {label : Accounts[i], "value" : i};
       labels.push(x);
     }
     this.setState({accountLabels : labels});
     console.log(this.state.accountLabels);
   });
 }
}
 /* New Account Address selected in dropdown => Change state variable */
 handleAccountChange = (e) => {
   //e.preventDefault();
   this.setState({account: e.value});
   this.setState({accountSelected: true});
   console.log("Account selected: " + this.state.accountList[e.value]);
 }
  render() {
    
    return (
  <div>          
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
  <title>DApp</title>
  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Alfa+Slab+One" />
  <link rel="stylesheet" href="assets/fonts/ionicons.min.css" />
  <link rel="stylesheet" href="assets/css/Login-Form-Dark.css" />
  <link rel="stylesheet" href="assets/css/styles.css" />
  <section className="login-dark">
    <nav className="navbar navbar-light navbar-expand-md">
      <div className="container-fluid"><a className="navbar-brand link-light" href="#" style={{color: 'var(--bs-yellow)', fontFamily: '"Alfa Slab One", serif'}}>&nbsp; NFT AUCTION</a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav">
            <li className="nav-item"><a className="nav-link active" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}><Link to="/conductElection">Conduct Election</Link></a></li>
            <li className="nav-item"><a className="nav-link" style={{color: 'var(--bs-yellow)', fontFamily: '"Alfa Slab One", serif'}}><Link to="/generateVoteKey">Generate Vote Key</Link></a></li>
            <li className="nav-item"><a className="nav-link" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}><Link to="/submitVote">Submit Vote</Link></a></li>
            <li className="nav-item" />
          </ul>
        </div>
      </div>
    </nav>
    <form method="post" id="conductElectionForm">
      <h2 className="visually-hidden">Election Form</h2>
      <div className="illustration"><i className="icon ion-ios-locked-outline" /></div>
      <div className="mb-3" />
      <div className="mb-3">
        <input className="form-control" onChange={this.handleChange} value={this.state.electionName} type="text" name="electionName" placeholder="Election Name" id="name" />
        <input className="form-control" onChange={this.handleChange} value = {this.state.candidateA} type="text" placeholder="Candidate A" name="candidateA" id="candidateA" />
        <input className="form-control" onChange={this.handleChange} value={this.state.candidateB} type="text" placeholder="Candidate B" name="candidateB" id="candidateB" /></div>
        <div className="mb-3">
        <div><p>Select an Account: </p> 
                <Select  label="Select an Account"
                        theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                ...theme.colors,
                                text: 'orangered',
                                neutral0: 'black',
                                primary25: 'hotpink',
                                primary: 'black',
                              },
                        })}
                        options={this.state.accountLabels} onChange={this.handleAccountChange}/>

            </div>
            </div>
      <div className="mb-3"><Button variant="btn btn-outline-success d-block w-100" onClick={this.conductElection} disabled={this.state.account == null}>{this.state.account == null ? 'Select an Account first':'Conduct Election'}</Button></div><a className="forgot" href="#">Rayyan Jafri</a>

      <Button variant="btn btn-outline-danger d-block w-100" type="sm" onClick={this.getAccounts}>{this.state.accountLoaded ? 'Refresh Accounts' : 'Get Accounts'}</Button>
                      
    </form>
  </section>
  <transactionresult />
</div>
    );
  }
}
export default App;
