import '../assets/css/Login-Form-Dark.css';
import '../assets/css/styles.css';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/fonts/ionicons.min.css';
import Select from 'react-select';
import {Component, useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import { voteKeyGenerator, zkProvider, iniZokrates}  from './zkProvider';
import {Election, Accounts, web3, iniAccounts} from './web3_utility';
import { withRouter } from 'react-router-dom';
import { initialize } from 'zokrates-js';
var JSONbig = require('json-bigint');
const candidateLabels =[{label:"Trump", value: 0 },{label:"Obama", value: 1 }];
class SubmitVoteForm extends Component {
    /* ==================================== INITIALIZATION & BINDING ==================================================*/
    constructor(props){
        super(props);
        this.state={
        candidateID: null,candidateName: "None", candidateLoaded: false, candidateList: [],candidateLabels: [{}], //Candidate Props
        account: null, accountList: null, accountLoaded: false, accountSelected: false, //Account Props
        secretKey: null, nullifier: null,  voteKey: null, proofGenerated: false, provingKey: null, provingKeySelected: false,//Zero-Knowledge Props
        membershipGenerator: null, zokFile: null, fileCompiled: false, generatedWitness: null //Zero-Knowledge Props
      };
        this.handleChange = this.handleChange.bind(this);
        this.handleSecretKey = this.handleSecretKey.bind(this);
                      /* Candidates */
        this.handleCandidateLabel = this.handleCandidateLabel.bind(this);
        this.getCandidates = this.getCandidates.bind(this);
                      /* Accounts */
        this.handleAccountChange = this.handleAccountChange.bind(this);
        this.getAccounts = this.getAccounts.bind(this);
                    /* Zokrates File MGMT */
        this.generateProof = this.generateProof.bind(this);
        this.getProvingKey = this.getProvingKey.bind(this);
        this.getZokFile = this.getZokFile.bind(this);
        this.compileZok = this.compileZok.bind(this);
            /* Initialization Second Phase */
        this.getAccounts();
        iniZokrates();
    }
    /*=====================================================================================================*/
    /* 
    * Generic handling function called upon when the user updates a selection
    */
    handleChange = (e) => {
      e.preventDefault();
      const val  = e.target.value.toString();
      this.setState({
        [e.target.name]: val  
      });
      console.log('State: ' + e.target.name + ' Value:' + val);
      }
      /* 
      * Specific handler for storing the secret key within the current state
      */
    handleSecretKey = (e) => {
      e.preventDefault();
      this.setState({secretKey: e.target.value});
      console.log("SK set");
    }
    /* 
    * Called upon when the user has fulfilled all pre-requistes 
    * required to submit the ZK-Proof to the blockchain
    */
   submitVote = async (e) => {
     e.preventDefault();
     var a = this.state.proof !== null; var  b = this.state.candidateID !== null;  var c = this.state.proofGenerated !== null;
     if(a &&  b && c){ 
       try {
          var keys = Object.keys(this.state.proof.proof); var keys2 = Object.keys(this.state.proof.inputs);
          console.log("[DEBUG] Proof attributes: " + this.state.proof + "\n [2]: " + keys + "\n " + keys2);
          let receipt = await Election.methods
          .submitVote(this.state.proof.proof.a,this.state.proof.proof.b, this.state.proof.proof.c, this.state.proof.inputs, this.state.candidateID)
          .send({ from: this.state.accountList[this.state.account], gas: 400000 });
          console.log("[submitVote] Transaction successful: \n"); 
          console.log(receipt);
        } catch(err){
          console.log("[submitVote] Error caught during send transaction. :" + err);
        }
      } else {
        console.log("[submitVote] Parameters not fulfilled. \n proofGenerated: " + c + "\n proof null: " + a + "\n CandidateID :" + b);
      }
    }
   /* =========================================== CANDIDATE MANAGEMENT ===================================================================*/
   /* 
   * Called upon when the user requests a list of candidates
   * from the Election state
   */
   getCandidates = async (e) => {
    e.preventDefault();
    if(this.state.accountLoaded && this.state.account != null){
      /* Retrieve Candidate List from Blockchain */
      console.log("Sending request to Blockchain..");
      await Election.methods.getTally()
      .call({ from: await this.state.accountList[this.state.account], gas: 4000000 })
      .then((receipt) => {
          console.log("Candidate List recieved: " + receipt);
          this.setState({candidateList: receipt});
          this.setState({candidateLoaded: true});
          /* Each name comes sequentially in an array, so i becomes the index */
          var labels = new Array();
          for(var i =0; i < receipt.length; i++)
            {
                var x = {label : receipt[i], "value" : i};
                labels.push(x);
            }
          this.setState({candidateLabels : labels});
          console.log(this.state.candidateLabels);
      });
      } 
      /* We haven't got an account to query the blockchain yet. */
      else {  this.getAccounts(); }
   }
    
    /* 
    * Called upon when the user updates their candidate selection
    */
    handleCandidateLabel= (argument) => {
      this.setState({candidateName: this.state.candidateList[argument.value]});
      this.setState({candidateID: argument.value});
      console.log("New Candidate Chosen: " + this.state.candidateName + " with ID: " + this.state.candidateID);
    }
   /* =========================================== ACCOUNT MANAGEMENT ==================================================================== */
   /* Called upon when the user requests the available accounts within the current node */
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
                      console.log("You are not connected to a blockchain. ");
                  }
             });
          }
    }
  
  /* Called upon when the user changes the Invoker Account */
  handleAccountChange = (e) => {
    //e.preventDefault();
    this.setState({account: e.value});
    this.setState({accountSelected: true});
    console.log("Account selected: " + this.state.accountList[e.value]);
  }
/*=================================================== ZOKRATES FILE MANAGEMENT ===================================================================================== */
/* 
* Called upon when the user wishes to select a .ZOK
* file for compilation.
*/
getZokFile = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  reader.addEventListener('load', (e) => {
    const buffer = reader.result;
    console.log("Data loaded successfully");
    this.setState({zokFile: buffer.toString()/*CHANGED*/});
  });
}
/* 
* Called upon when the user wishes to compile a selected .ZOK
* file 
*/
compileZok = (e) => {
  e.preventDefault();
  if(zkProvider !== undefined){
  this.setState({membershipGenerator: zkProvider.compile(this.state.zokFile)});
  this.setState({fileCompiled: true});
  console.log("ZK-Circuit compiled successfully. ")
  } else {
    iniZokrates();
    console.log("Zokrates hasn't initialized yet.");
  }
}
/* 
* Called upon when the user attempts to load the proving key 
* for proof generation
*/
getProvingKey = (event) => {
  const file = event.target.files[0];
  //console.log('files: ' + file);
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.addEventListener('load', (e) => {
    const buffer = new Uint8Array(reader.result);
    console.log("Data loaded successfully");
    this.setState({provingKey: buffer});
  });
}
/* 
* Called upon when the user tries to generate a proof of membership
*/
generateProof = async (e) => {
  e.preventDefault();
  if(zkProvider !== undefined){
    console.log("Retreiving your Merkle Information.");
    /*======================================================== GET MERKLE INFO ===================================================================*/
    let result = await Election.methods
     .getMerkleInfo(this.state.voteKey)
     .call({ from: this.state.accountList[this.state.account], gas: 400000 });
       /* Callback from getMerkleInfo*/
       var merkleArray = []; var targetIndex = 0; var firstLayerSize = 0; var currentNodeIndex;

       targetIndex = parseInt(result.targetIndex); firstLayerSize = parseInt(result.firstLayerSize);
      for(var i = result.entireMerkleArray.length; i > 0; i--){
        merkleArray.push(result.entireMerkleArray[i-1]);
      }
       for(var i =0; i < merkleArray.length; i++){
         if(this.state.voteKey == merkleArray[i]){
           console.log("Your Vote-Key was found registered in the leaves. Building Proof.");
           currentNodeIndex = i;
         }
       }
       console.log("Your leaf index:" + currentNodeIndex + "\n First Layer Size: " + firstLayerSize + "\n Merkle Array: " + merkleArray); //DEBUG

       /*========================================================== PROOF OF MEMBERSHIP PRE-COMPUTATIONS =========================================*/

       /* Explicitly convert the general types because javascript sucks lol */
       var merkleRoot = result.mkRoot;
       var offset = firstLayerSize-1;
       var siblingNodes = [];
       var dirSelector = [];


       /* We iterate UPWARDS from each layer*/
       while(offset != 1 && currentNodeIndex > 0) { //Always a div of 2, when = 1 -> Reached MK 
          var siblingIndex;
          if(currentNodeIndex % 2 == 0){ 
              dirSelector.push(false); 
              //We are on the LEFT child, we want to add our RIGHT neighbour at index - 1 
              siblingIndex = currentNodeIndex - 1;
              siblingNodes.push(String(merkleArray[siblingIndex])); 
              currentNodeIndex = (currentNodeIndex/2) - 1;
          } else { 
              // We are on the RIGHT child, hence we are the SECOND argument in Hash(x,y) we want to add our neighbour that is on the index - 1
              dirSelector.push(true); 
              siblingIndex = currentNodeIndex + 1;
              // Field values must be converted to string in order for ZOKRATES Circuit to parse it without overflow. 
              siblingNodes.push(String(merkleArray[siblingIndex])); 
              currentNodeIndex = Math.floor(currentNodeIndex/2);
          }
          offset = offset / 2;
       }  
      /*================================================= PROOF OF MEMBERSHIP GENERATION ========================================================*/ 
       console.log("Computing a witness and then generating a proof of membership for you.");

      initialize().then((zkProvider) => {
          console.log("MembershipTest(" + this.state.secretKey + ", " + this.state.nullifier + ", " + merkleRoot + ", " + dirSelector + "," + siblingNodes);
          const {witness, _} = zkProvider.computeWitness(this.state.membershipGenerator, [this.state.secretKey, this.state.nullifier, merkleRoot, dirSelector, siblingNodes]);
          this.setState({generatedWitness: witness});
          console.log("End of Witness Conduct \n");
      }).catch((err) => {
          console.log("Error caught during witness computation: " + err);
          this.setState({generatedWitness: null});
      }).finally(() => {
          console.log("Async Witness Op concluded.");
          /* Only after witness computation, begin proof generation*/
          if(this.state.generatedWitness != null){
                initialize().then((zkProvider) => {
                    console.log("Conducting Proof Generation")
                    let localProof = zkProvider.generateProof(this.state.membershipGenerator.program, this.state.generatedWitness, this.state.provingKey);
                    console.log("Proof Generated successfully. ");
                    this.setState({proof:localProof}); 
                }).catch((err) => {
                    console.log("Error during Proof Generation: " + err);
                }).finally( () => {
                    this.setState({proofGenerated: true});
                    console.log("Conduct Finished.")
                });
          } else {
              console.log("You provided an invalid combination of secretKey and VoteKey, thus the proof could not be generated.");
          }
      });
  }
}
/*================================== COMPONENT RENDER ============================================*/ 
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
                  <li className="nav-item"><a className="nav-link" href="/submitVote" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Submit Vote</a></li>
                  <li className="nav-item"><a className="nav-link" href="/results" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Results</a></li>
                  <li className="nav-item" />
                </ul>
              </div>
            </div>
          </nav>
          <div className="alert alert-success" role="alert"><span><strong>Query the Candidate List using the Available Accounts, Pick a candidate and supply your secret key, this will automatically generate a zero-knowledge proof of membership and use it to submit your vote option to the blockchain. If an incorrect secret key is provided, the proof being sent to the chain will be rejected.&nbsp;</strong></span></div>
          <form method="post">
            <h2 className="visually-hidden">Login Form</h2>
            <div className="illustration"><i className="icon ion-ios-locked-outline" /></div>
            <div className="mb-3" />
            <div> 
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
                <Button variant="btn btn-primary d-block w-100" disabled={!this.state.accountSelected} onClick={this.getCandidates}>{this.state.accountSelected ? 'Get Candidates' : 'Select an Account First'}</Button>
                <div className="mb-3" /> 
                <a>{this.state.candidateName == "None" ? '' : this.state.candidateName  } </a>
                <Select className=".dropdown" name="Select a Candidate"
                        isDisabled = {!this.state.candidateLoaded}
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
                        options={this.state.candidateLabels} onChange={this.handleCandidateLabel}/>
  
            </div>
          
<div>
<div className="mb-3"><div className="mb-3" />
<input className="form-control" type="text" name="secretKey" id="secretKey" onChange={this.handleSecretKey} placeholder="Enter your Secret Key" />
<input className="form-control" type="text" name="nullifier" id="nullifier" onChange={this.handleChange} placeholder="Enter your unique identifier" />
<div className="mb-3" />


<input className="form-control" type="text" name="voteKey" id="voteKey" onChange={this.handleChange} placeholder="Enter your Vote Key" />

<div className="mb-3" />

<input type="file" id="fileGetter_Hash" onChange={this.getZokFile}></input>  


<div className="mb-3" />
<Button variant="btn btn-outline-info d-block w-100" onClick={this.compileZok}> Compile Circuit </Button>
<div className="mb-3" />


<input type="file" id="fileGetter_Member" onChange={this.getProvingKey}></input>  
<div className="mb-3" />
<Button variant="btn btn-outline-info d-block w-100"  disabled={this.state.membershipGenerator == null} onClick={this.generateProof}> {!this.state.fileCompiled ? 'Compile Circuit first' : 'Generate Proof'}</Button>
<div className="mb-3" />


<Button variant="btn btn-outline-success d-block w-100" disabled={!this.state.proofGenerated} onClick={this.submitVote}> {this.state.proofGenerated ? 'Submit Vote' : 'Generate Proof first'}</Button>
<div className="mb-3" />


<Button variant="btn btn-outline-danger d-block w-100" type="sm" onClick={this.getAccounts}>{this.state.accountLoaded ? 'Refresh Accounts' : 'Get Accounts'}</Button></div>


</div>
           
            <div className="mb-3" />
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