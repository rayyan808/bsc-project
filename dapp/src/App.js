import './assets/css/Login-Form-Dark.css';
import './assets/css/styles.css';
import {Component} from 'react';
import {useRoutes} from './routes';
import { BrowserRouter, Link, Switch, Route, Router} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import Select from 'react-select';
import * as paillierBigint from 'paillier-bigint';
import VoteKeyGeneratorForm from './components/VoteKeyGeneratorForm';
import {Election, Accounts, web3, iniAccounts} from './components/web3_utility';
import {iniZokrates, zkProvider} from './components/zkProvider';
const Abi = require ('./assets/contracts/electionAbi.json');
const ESSerializer = require('esserializer');
var JSONbig = require('json-bigint');
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        electionName: "SNARK-Web Election",
        candidateA: "Donald Trump",
        candidateB: "Kim Jong-Un",
        account: null,
        accountSelected: false,
        accountList: [],
        accountLabels: [{}],
        publicKeyN: "",
        publicKeyG: "",
        privateKey: null,
        privateKeyFile: {}
      };
      this.handleChange = this.handleChange.bind(this);
      this.conductElection = this.conductElection.bind(this);
      this.generateKeyPair = this.generateKeyPair.bind(this);
      //this.useRoutes = this.useRoutes.bind(this);
      iniAccounts();
    iniZokrates();
    }
// 
   handleChange = (e) => {
    const val  = e.target.value;
    this.setState({
      [e.target.name]: val
    });
    console.log('State: ' + e.target.name + ' Value:' + val);
    };
    /* <==================================== PAILLER ENCRYPTION  ==========================================================> */
    generateKeyPair = async (e) => {
      e.preventDefault();
      const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(1024)
      const privateKeyJSON = JSONbig.stringify(privateKey); const publicKeyJSON = JSONbig.stringify(publicKey);
      //const y = new paillierBigint.PublicKey(publicKey.n, publicKey.g);
      const x = new paillierBigint.PrivateKey(privateKey.lambda,privateKey.mu, publicKey);
      //let privateKeyStore = ESSerializer.serialize(x);
      //When owner decrypts and finds out the solution, he sends a zero-knowledge proof that hisResult == the actual result
      //def main(private secretKey, )
      this.setState({publicKeyN: publicKey.n, publicKeyG : publicKey.g, 
        privateKey: privateKeyJSON,   
        keyGenerated: true});

      console.log(this.state.publicKeyG);
      this.generateDownload(privateKeyJSON); //Allow the owner to download their private key for later usage (decrypt )
    }
    paillierTest = async () => {
      // (asynchronous) creation of a random private, public key pair for the Paillier cryptosystem
      const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(2048)
    
      // Optionally, you can create your public/private keys from known parameters
      // const publicKey = new paillierBigint.PublicKey(n, g)
      // const privateKey = new paillierBigint.PrivateKey(lambda, mu, publicKey)
    
      const m1 = 12345678901234567890n
      const m2 = 5n
    
      // encryption/decryption
      const c1 = publicKey.encrypt(m1)
      console.log(privateKey.decrypt(c1)) // 12345678901234567890n
    
      // homomorphic addition of two ciphertexts (encrypted numbers)
      const c2 = publicKey.encrypt(m2)
      const encryptedSum = publicKey.addition(c1, c2)
      console.log(privateKey.decrypt(encryptedSum)) // m1 + m2 = 12345678901234567895n
    
      // multiplication by k
      const k = 10n
      const encryptedMul = publicKey.multiply(c1, k)
      console.log(privateKey.decrypt(encryptedMul)) // k · m1 = 123456789012345678900n
    }
    /* ================================================ FILE MANAGEMENT     =================================================> */
    generateDownload = (json) => {
      const blob=new Blob([json],{type:'application/json'})
      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (this.state.privateKeyURL !== null) {
        window.URL.revokeObjectURL(this.state.privateKeyURL);
      }
  
      this.setState({privateKeyURL: window.URL.createObjectURL(blob)});

    };
    /* ================================================ SMART CONTRACT CALL =================================================> */
   conductElection = async (e) => {
    e.preventDefault();
    if(this.state.electionName !== undefined && this.state.candidateA !== undefined && this.state.candidateB !== null && this.state.publicKey !== null){
    //await this.iniDApp();
    console.log("Sending request to Blockchain network \n");
    console.log("Account initialized: " + Accounts[0]);
    console.log(this.state.electionName +  "\n");

    console.log("Invoking conductElection on the blockchain.")
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
     /* =========================================== ACCOUNT MANAGEMENT ==================================================================== */
   /* Click button 'Get Accounts' => Async retrieve accounts via web3 utility*/
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
 /* New Account Address selected in dropdown => Change state variable */
 handleAccountChange = (e) => {
   //e.preventDefault();
   this.setState({account: e.value});
   this.setState({accountSelected: true});
   console.log("Account selected: " + this.state.accountList[e.value]);
 }
 /* ========================================================================================================================================= */
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
                 
      <div className="mb-3"></div>      
      <Button variant="btn btn-outline-danger d-block w-100" type="sm" onClick={this.getAccounts}>{this.state.accountLoaded ? 'Refresh Accounts' : 'Get Accounts'}</Button>
                      
    </form>
  </section>
  <transactionresult />
</div>
    );
  }
}
export default App;
/*  <div className="mb-3">
      <Button variant="btn btn-outline-primary d-block w-100" disabled={this.state.publicKey == null}onClick={() => {navigator.clipboard.writeText(this.state.publicKey)}}>Copy Public Key</Button> </div>
      <Button variant="btn btn-outline-danger d-block w-100" disabled={this.state.privateKey == null} onClick={() => {navigator.clipboard.writeText(this.state.privateKey)}}>Copy Private Key</Button> 
      <div className="mb-3"></div>
      <Button variant="btn btn-outline-danger d-block w-100" type="sm" onClick={this.generateKeyPair}>{this.state.keyGenerated ? 'Get new key pair' : 'Generate Keypair'}</Button> */