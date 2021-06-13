import '../assets/css/Login-Form-Dark.css';
import '../assets/css/styles.css';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/fonts/ionicons.min.css';

import {Component, useEffect, useState} from 'react';
import { voteKeyGenerator, zkProvider, iniZokrates}  from './zkProvider';
import {Election, Accounts, web3, iniAccounts} from './web3_utility';
import { withRouter } from 'react-router-dom';
import { initialize } from 'zokrates-js';

const data =[{"name":"test1"},{"name":"test2"}];
class SubmitVoteForm extends Component {
    constructor(props){
        super(props);
        this.state={candidateID: null,candidateName: "None", candidateList: ["Trump", "Obama"], secretKey: null};
        this.handleChange = this.handleChange.bind(this);
        this.handleSecretKey = this.handleSecretKey.bind(this);
        this.checkButtonDisplay = this.checkButtonDisplay.bind(this);
        iniAccounts();
        iniZokrates();
    }
  /*  handleChange = (e) => {
      const val  = e.target.value;
      this.setState({
        [e.target.name]: val
      });
      console.log('State: ' + e.target.name + ' Value:' + val);
      };*/
       /* Only display the submit vote option if both fields have (valid) inputs*/
    checkButtonDisplay = () => {
      if(this.state.secretKey != null && this.state.candidateID != null){
          return (<button className="btn btn-outline-success d-block w-100" type="submit" onClick={this.submitVote}>Submit Vote</button>)
      }
    }
    handleChange = (e) => {
        e.preventDefault();
        this.setState({candidateID: e.target.value});
        this.setState({candidateName: this.state.candidateList[e.target.value]});
        console.log("New candidate chosen: " + this.state.candidateName + "with ID:" + this.state.candidateID);
        this.checkButtonDisplay();
    }
    handleSecretKey = (e) => {
      e.preventDefault();
      this.setState({secretKey: e.target.value});
      console.log("SK set");
      this.checkButtonDisplay();
    }
   submitVote = async (e) => {
     e.preventDefault();
     /* Generate a Proof*/
        /* Call Election.getMerkleInfo */
        console.log("Retreiving your Merkle Information.");
         Election.methods
          .getMerkleInfo(this.state.electionName, 3, this.state.candidateA, this.state.candidateB)
          .call({ from: Accounts[0], gas: 400000 }, (err, val) => {
            /* Callback from getMerkleInfo*/
            const returnVal = val;
            console.log("GetMerkleInfo returned: " + returnVal);
          });
       
          console.log("End of Conduct \n");
        /* Call zk.generateProof*/
   }
    render () {
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
                  <li className="nav-item"><a className="nav-link" href="/" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Submit Vote</a></li>
                  <li className="nav-item" />
                </ul>
              </div>
            </div>
          </nav>
          <div className="alert alert-success" role="alert"><span><strong>Pick a candidate and supply your secret key, this will automatically generate a zero-knowledge proof of membership and use it to submit your vote option to the blockchain. If an incorrect secret key is provided, the proof being sent to the chain will be rejected.&nbsp;</strong></span></div>
          <form method="post">
            <h2 className="visually-hidden">Login Form</h2>
            <div className="illustration"><i className="icon ion-ios-locked-outline" /></div>
            <div className="mb-3" />
            <div> 

  <ul>
    {this.state.candidateList.map((element, index) => {
                      console.log("element: " + element + "index: " + index);
                      return(<li onClick={this.handleChange/**idx */} name={element} value={index} key={index} id={index}>{element}</li>);
                    })};
  </ul>

  <a>Selected Candidate: {this.state.candidateName} </a>
</div>
            <div className="dropdown">
                
                
                <a className="btn btn-outline-primary dropdown-toggle link-primary" data-bs-toggle="dropdown" id="collapseCandidateList" role="button" aria-expanded="true" data-bs-target="collapseCandidateList" type="button" style={{color: 'var(--bs-green)'}}>Choose Candidate&nbsp; </a>
              
              
              <div className="dropdown-menu" aria-labelledby="collapseCandidateList">
                <a className="dropdown-item" href="#"> Example </a>
                    {this.state.candidateList.map((element, index) => {
                      console.log("element: " + element + "index: " + index);
                      return(<a className="dropdown-item" onClick={this.handleChange/**idx */} value={this.state.candidate} name={index} key={index} id={index}>{element}</a>);
                    })};
                  </div>
            </div>
            <div className="mb-3" /><input className="form-control" type="text" name="secretKey" id="secretKey" onChange={this.handleSecretKey} placeholder="Enter your Secret Key" />
           
            <div className="mb-3" />
          {this.checkButtonDisplay()}
            <a className="forgot" href="#">Rayyan Jafri</a>
          </form>
        </section>
        <script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js"></script>
      </div>
          );
    }
}

export default withRouter(SubmitVoteForm);