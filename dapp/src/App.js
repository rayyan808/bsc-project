import './assets/css/Login-Form-Dark.css';
import './assets/css/styles.css';
import {Component} from 'react';
import { Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import Select from 'react-select';
import {Election, Accounts, iniAccounts} from './components/web3_utility';
import {iniZokrates} from './components/zkProvider';
class App extends Component {
  /*=================== INITIALIZATION & BINDING =========================*/ 
  constructor(props){
    super(props);
    this.state = {
        electionName: "SNARK-Web Election",
        candidateA: "Donald Trump",
        candidateB: "Kim Jong-Un",
        account: null,
        accountSelected: false,
        accountToAuthorize: null,
        accountList: [],
        accountLabels: [{}],
        publicKeyN: "",
        publicKeyG: "",
        privateKey: null,
        privateKeyFile: {}
      };
      /* 
      * Defining the binders within the constructors assure one-to-one mapping per instance
      * and provides better performance
      */
      this.handleChange = this.handleChange.bind(this);
      this.conductElection = this.conductElection.bind(this);
      this.authorizeAccount = this.authorizeAccount.bind(this);
      this.handleAuthorizeAccountChange = this.handleAuthorizeAccountChange.bind(this);
      iniAccounts();
      iniZokrates();
    }
    /* 
    * Generic handling function called upon when the user updates a selection
    */
    handleChange = (e) => {
      const val  = e.target.value;
      this.setState({
        [e.target.name]: val
      });
      console.log('State: ' + e.target.name + ' Value:' + val);
    };
    /* ================================================ SMART CONTRACT CALL =================================================> */
    /* 
    * Called upon when the user invokes conduct election with appropiate parameters selected.
    */
   conductElection = async (e) => {
      e.preventDefault();
      if(this.state.electionName !== undefined && this.state.candidateA !== undefined && this.state.candidateB !== null && this.state.publicKey !== null){
     
      console.log("Sending request to Blockchain network \n");

    console.log("Invoking election: " + this.state.electionName + " on the blockchain.")
    await Election.methods
      .conductElection(this.state.electionName, this.state.candidateA, this.state.candidateB)
      .send({ from: Accounts[this.state.account], gas: 4000000 }).then(async (receipt) => {
        console.log(receipt);
      });
      console.log("End of Conduct \n");
    } else {
      console.log("Enter values for Election Name & Candidates");
    }
  }
  /* 
  * Called upon when a user authorizes a node for Vote-Key submission
  */
 authorizeAccount = async (e) => {
   e.preventDefault();
   await Election.methods
      .authorize(Accounts[this.state.accountToAuthorize])
      .send({ from: Accounts[this.state.account], gas: 4000000 }).then(async (receipt) => {
        console.log(receipt);
      });
 }
     /* =========================================== ACCOUNT MANAGEMENT ==================================================================== */
   /* 
   * Retrieve the accounts available within the current node (Within a local environment, this is your test-RPC or Ganache Accounts)
   */
   getAccounts = async (e) => {
    if( e !== undefined) {e.preventDefault();}
    if(!this.state.accountLoaded){
   console.log("Retrieving Accounts from Blockchain.");
   await iniAccounts().then(( ) => { 
     if(Accounts !== undefined){
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
      console.log("Could not connect to blockchain. Check if Ganache is running. Is your contract address configured?")
    }
   });
 }
}
 /* Called upon when the user selects a new Invoker Account */
 handleAccountChange = (e) => {
   //e.preventDefault();
   this.setState({account: e.value});
   this.setState({accountSelected: true});
   console.log("Account selected: " + this.state.accountList[e.value]);
 }
 /* Called upon when the user selects a new account to Authorize */
 handleAuthorizeAccountChange = (e) => {
  //e.preventDefault();
  this.setState({accountToAuthorize: e.value});
  console.log("Account to authorize selected: " + this.state.accountList[e.value]);
}
/*================================== COMPONENT RENDER ============================================*/ 
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
            <li className="nav-item"><a className="nav-link" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}><Link to="/results">Results</Link></a></li>
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
        <div><p>Delegate an Invoker Account: </p> 
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
      <div className="mb-3"><Button variant="btn btn-outline-success d-block w-100" onClick={this.conductElection} disabled={this.state.account == null}>{this.state.account == null ? 'Select an Invoker Account':'Conduct Election'}</Button></div>
                 
      <div className="mb-3"/>  
      <div className="mb-3">  
      <Button variant="btn btn-outline-danger d-block w-100" type="sm" onClick={this.getAccounts}>{this.state.accountLoaded ? 'Refresh Accounts' : 'Get Accounts'}</Button>
      <div className="mb-3"></div>
      <div className="mb-3"></div>
      <div className="mb-3">
        <div><p>Select an account to authorize: </p> 
                <Select  name="accountToAuthorize" label="Select an Account"
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
                        options={this.state.accountLabels} onChange={this.handleAuthorizeAccountChange}/>

            </div>
            </div>  
        <Button variant="btn btn-outline-danger d-block w-100" type="sm" onClick={this.authorizeAccount}disabled={this.state.account == null}>{this.state.accountLoaded ? 'Authorize Node' : 'Select Owner as Invoker Account'}</Button>
        </div>
         
    <a className="forgot" href="#">Rayyan Jafri</a>
    </form>
  </section>
  <transactionresult />
</div>
    );
  }
}
export default App;