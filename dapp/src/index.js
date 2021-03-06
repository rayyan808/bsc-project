import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Redirect, Switch, Route} from 'react-router-dom';
import './index.css';
import App from './App';
import Results from './components/results';
import reportWebVitals from './reportWebVitals';
import VoteKeyGeneratorForm from './components/VoteKeyGeneratorForm';
import SubmitVoteForm from './components/submitVote';
import {iniAccounts} from './components/web3_utility';
import { iniZokrates } from './components/zkProvider';
ReactDOM.render(
  <React.StrictMode>
    <Router>
    <Switch>
    <Route path="/generateVoteKey" render={(props) => <VoteKeyGeneratorForm {...props} />} />
    <Route path="/conductElection" render={(props) => <App {...props} />} />
    <Route path="/submitVote" render={(props) => <SubmitVoteForm {...props} />} />

    <Route path="/results" render={(props) => <Results {...props} />} />
    <Redirect to="/conductElection"/>
          </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
