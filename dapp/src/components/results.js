import '../assets/css/Login-Form-Dark.css';
import Button from 'react-bootstrap/Button';
import '../assets/css/styles.css';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/fonts/ionicons.min.css';
import Select from 'react-select';
import {Component, useEffect, useState} from 'react';
import ResultCard from './ResultCard';
import {Election, Accounts, web3, iniAccounts} from './web3_utility';
import { withRouter } from 'react-router-dom';
class Results extends Component { 
  constructor(props){
    super(props);
    this.state = {
      accountLabels: [],
      candidateList: [], candidateLoaded : false, votes : [], uniqueIdentifiers: [],
      candidateID: null, candidateTitle: null, totalCandidates: null
    }
    this.getCandidates.bind(this.getCandidates);
    this.getAccounts.bind(this.getAccounts);
    this.handleAccountChange.bind(this.handleAccountChange);
  }
  getCandidates = async (e) => {
    e.preventDefault();
    if(this.state.accountLoaded && this.state.account != null){
      /* Retrieve Candidate List from Blockchain */
      console.log("Sending request to Blockchain..");
      await Election.methods.getTally().call({from: await this.state.accountList[this.state.account], gas: 4000000})
      .then((receipt) => {
        console.log("Candidate Object list recieved: " + receipt);
        for(var i=0; i< receipt.length; i++){
          this.state.candidateList.push(receipt[i].name);
          this.state.votes.push(receipt[i].votes.length);
          console.log("Candidate Index:" + i + "has total vote count: " + receipt[i].votes.length);
          var x = new Array();
          for(var k=0; k < receipt[i].votes.length; k++){
            x.push(receipt[i].votes[k]);
          }
          this.state.uniqueIdentifiers.push(x);
          console.log("Proposal" + receipt[i].name + "(ID: " + i + ") got (" + receipt[i].votes.length + ") votes by Unique Identifiers: " + receipt[i].votes);
        }
        console.log(this.state.uniqueIdentifiers)
        this.setState({candidateLoaded: true});
      });
      } 
      /* We haven't got an account to query the blockchain yet. */
      else {  this.getAccounts(); }
   }
   getAccounts = async (e) => {
    if( e !== undefined) {e.preventDefault();}
    if(!this.state.accountLoaded){
   console.log("Retrieving Accounts from Blockchain.");
   await iniAccounts().then(() => { 
     if(Accounts != undefined) {
     this.setState({accountList : Accounts});
     this.setState({accountLoaded: true});
     var labels = new Array();
     for(var i =0; i < Accounts.length; i++){
       var x = {label : Accounts[i], "value" : i};
       labels.push(x);
     }
     this.setState({accountLabels : labels});
     console.log(this.state.accountLabels);
   } else {
     //@TODO: Error Pop-UP
     console.log("You are not connected to a blockchain. ");
   }
   });
 }
}
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
                  <li className="nav-item"><a className="nav-link active" href="/conductElection" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Conduct Election</a></li>
                  <li className="nav-item"><a className="nav-link" href="/generateVoteKey" style={{color: 'var(--bs-yellow)', fontFamily: '"Alfa Slab One", serif'}}>Generate Vote Key</a></li>
                  <li className="nav-item"><a className="nav-link" href="/submitVote" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Submit Vote</a></li>
                  <li className="nav-item"><a className="nav-link" href="/results" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Results</a></li>
                  <li className="nav-item" />
                </ul>
              </div>
            </div>
          </nav>

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
            <Button variant="btn btn-outline-danger d-block w-100" type="sm" onClick={this.getAccounts}>{this.state.accountLoaded ? 'Refresh Accounts' : 'Get Accounts'}</Button>
            <Button variant="btn btn-primary d-block w-100" disabled={!this.state.accountSelected} onClick={this.getCandidates}>{this.state.accountSelected ? 'Get Candidates' : 'Select an Account first'}</Button>
            {!this.state.candidateLoaded ? <Button disabled={true} variant="btn btn-outline-danger"> You must Query the candidates using an account first</Button> : (
       this.state.candidateList.map((mappedElement, index) => {
        console.log("rendering " + mappedElement);
        return(<ResultCard key={index} title={mappedElement} index={index} votes={this.state.votes[index]} uniqueIdentifiers={this.state.uniqueIdentifiers[index]}  />);
          }))
        }
        </section>
      </div>
    );
  }
}
export default withRouter(Results);