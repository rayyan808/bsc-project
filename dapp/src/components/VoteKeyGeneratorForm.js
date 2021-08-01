import '../assets/css/Login-Form-Dark.css';
import '../assets/css/styles.css';
import '../assets/bootstrap/css/bootstrap.min.css';
import {Component, useEffect, useState} from 'react';
import { iniZokrates, voteKeyGenerator, zkProvider}  from './zkProvider';
import {Election, Accounts, web3, iniAccounts, getAccounts} from './web3_utility';
import { withRouter } from 'react-router-dom';
import {initialize, metadata } from 'zokrates-js';
import Select from 'react-select';
class VoteKeyGeneratorForm extends Component {
  /*==================================== INITIALIZATION & BINDING ===============================================*/ 
    constructor(props){
        super(props);
        this.state = {
            secretKey: null,
            voteKey: null,
            identifier: null,
            account: null,
            accountList: Accounts,
            voteKeyGenerator: null,
            accountLoaded: false,
            hashBinary: null,
            zokFile: null,
            witness: null,
            accountLabels: [{}]
          };
          this.handleChange = this.handleChange.bind(this);
          this.generateVoteKey = this.generateVoteKey.bind(this);
          this.getHashBinary = this.getHashBinary.bind(this);
          this.submitVoteKey = this.submitVoteKey.bind(this);
          this.getZokFile = this.getZokFile.bind(this);
          this.compileZok = this.compileZok.bind(this);
          this.displayGenerateVoteKey = this.displayGenerateVoteKey.bind(this);
          this.displaySubmitVoteKey = this.displaySubmitVoteKey.bind(this);
         this.bootUp = this.bootUp.bind(this);
         this.getAccounts = this.getAccounts.bind(this);
         this.displayAccountlist = this.displayAccountlist.bind(this);
         this.generateMerkle = this.generateMerkle.bind(this);
         this.bootUp();
        }
        bootUp = async () => {
         iniAccounts().then((acc) => { 
           if(Accounts !== undefined){
            this.state.accountList = Accounts;
            console.log("Bootup accountlist: " + this.state.accountList);
            this.state.accountLoaded = true;
            var labels = new Array();
            for(var i =0; i < this.state.accountList.length; i++){
              var x = {label : this.state.accountList[i], "value" : i};
              labels.push(x);
            }
            this.state.accountLabels = labels;
            console.log(this.state.accountLabels);
          } else {
            console.log("You are not connected to a blockchain. ");
          }
          });
          await iniZokrates();
        }
        getAccounts = async (e) => {
          e.preventDefault();
          iniAccounts();
        }
    /* 
    * Generic handling function called upon when the user updates a selection
    */
   handleChange = (e) => {
    const val  = e.target.value;
    console.log("Target Name: " + e.target.name + "Target Value: " + e.target.value)
    this.setState({
      [e.target.name]: val
    });
    console.log('State: ' + e.target.name + ' Value:' + val);
    };


    /*============================================ VOTE KEY MANAGEMENT ==========================================*/ 


    /* 
    * Called upon when the user wishes to hash their secretKey and Unique Identifier.
    *  Utilizes the Zokrates.JS library and the custom-made MiMC ZIR Circuit  
    */
    generateVoteKey = (e) => {
      e.preventDefault();
      initialize().then((zkProvider) => {
        
        console.log("Computing Witness fo")
        console.log("COMPILER ZOK-JS: " + metadata.version)
        let computationResult = zkProvider.computeWitness(this.state.voteKeyGenerator, [[this.state.secretKey,this.state.identifier]]); //PRODUCTION
        /* Clean up and extract the VoteKey from the Zokrates RAW Output */
        var rawString = computationResult.output.trim();
        rawString = rawString.replace("[", "");
        rawString = rawString.replace("]", ""); 
        rawString = rawString.replaceAll("\"", ""); 
        rawString = rawString.replaceAll("\"", "");
        rawString = rawString.replaceAll("\n", "");
        //NOTE: String is parsed as BigInt on-chain, limited to 256-bits
        this.setState({voteKey : rawString});
        this.setState({witness: computationResult.witness });
        console.log("Your vote key is: " + this.state.voteKey);
      });

    }


    /** 
     * 
     * @param {event object recieved from onClick} e 
     * Submits the Vote Key to the chain (Secret Key never leaves the DApp)
     */
    submitVoteKey = async (e) => {
        e.preventDefault();
        console.log("Sending request to Blockchain network \n");
        console.log(this.state +  "\n");
        var bigVal = this.state.voteKey;
        await Election.methods
          .pushVoteKey(bigVal)
          .send({ from: await this.state.accountList[this.state.account], gas: 4000000 }).then((receipt) => {
            console.log(receipt);
          });
       
          console.log("End of Conduct \n");
    }


    displayGenerateVoteKey = () => {
      if(this.state.voteKeyGenerator != null){
        return (<div className="mb-3"><button className="btn btn-primary d-block w-100" type="submit" onClick= {this.generateVoteKey}>Generate Vote Key</button></div>)
      }
    }


    displaySubmitVoteKey = () => {
      if(this.state.voteKey != null){
       return(<div className="mb-3"><a>Your vote key: {this.state.voteKey} </a><button className="btn btn-primary d-block w-100" type="submit"  onClick= {this.submitVoteKey}>Submit Vote Key</button></div>)
      }
    }


    /*============================================ FILE MANAGEMENT ==================================*/ 
    /* 
    * Called upon when the user wishes to select a .ZOK
    * file for compilation.
    */
    getZokFile = (event) => {
      console.log("Get Zok File caled");
      const file = event.target.files[0];
      console.log('files: ' + file);
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener('load', (e) => {
        const buffer = reader.result;
        const bufferLength = buffer.length;
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
      console.log(this.state.zokFile);
      this.setState({voteKeyGenerator: zkProvider.compile(this.state.zokFile)});
      console.log("artifact compiled: " + this.state.voteKeyGenerator);
      } else {
        iniZokrates();
        console.log("Zokrates hasn't initialized yet.");
      }
    }


    /*================================== ACCOUNT MANAGEMENT =================================*/
    /* 
    *Called upon when the user changes the Invoker Account 
    */
    handleAccountChange = (e) => {
      this.setState({account: e.value});
      console.log("Account selected: " + this.state.accountList[e.value]);
  }

  /* 
  * Called upon when the user manually retrieves the available node accounts
  */
  displayAccountlist = (e) => {
    e.preventDefault();
    if(this.state.accountList != null) {
      console.log("Displaying Account List");
      this.state.accountList.map((element, index) => {
        console.log("Account found: " + element);
        return(<li><a>{element}</a></li>)
    });
  } else {
    console.log("Account list loading..");
      return(<li><a>Accounts are still loading..</a></li>);
  }
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
                          <li className="nav-item"><a className="nav-link active" href="/conductElection.html" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Conduct Election</a></li>
                          <li className="nav-item"><a className="nav-link" href="/generateVoteKey.html"  style={{color: 'var(--bs-yellow)', fontFamily: '"Alfa Slab One", serif'}}>Generate Vote Key</a></li>
                          <li className="nav-item"><a className="nav-link" href="/submitVote" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Submit Vote</a></li>
                          <li className="nav-item"><a className="nav-link" href="/results" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Results</a></li>
                          <li className="nav-item" />
                        </ul>
                      </div>
                    </div>
                  </nav>
                  <div className="alert alert-success" role="alert"><span><strong>The objective of this DApp is to keep maximal control with the user, thus you should compile the ZK circuits locally. Provide your Secret Key and the path to the Zero-Knowledge Circuit and compile. You may then generate a vote key. Once this process is done, you can submit this Vote Key to the blockchain.</strong></span></div>
                  <form method="post" id="VoteKeyGenerationForm">
                    <h2 className="visually-hidden">Vote Key Generation Form</h2>
                    <div className="illustration"><i className="icon ion-ios-locked-outline" /></div>
                    <div className="mb-3" />
                    <div className="mb-3"><input className="form-control" type="password" id="secretKey" name="secretKey" onChange = {this.handleChange} placeholder="Enter a Secret Key" /></div>

                    <div className="mb-3"><input className="form-control" type="text" id="identifier" name="identifier" onChange = {this.handleChange} placeholder="Enter an Identifier" /></div>
                    <input type="file" id="fileGetter_Hash" onChange={this.getZokFile}></input>        
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type="submit" onClick= {this.compileZok}>Compile </button></div>
                    {this.displayGenerateVoteKey()}
                    {this.displaySubmitVoteKey()}
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type="submit" onClick= {this.displayAccountlist}>Get Accounts</button></div>
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type="submit" onClick= {this.generateMerkle}>[DEBUG] Generate on-chain merkle</button></div>
<p>Available Accounts: </p> 
 <Select className=".dropdown" label="Select an Account"
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


                    <a className="forgot" href="/conductElection.html">Want to start your own election?</a>
                  </form>
                </section>
              </div>
            );
            }
      /* debug */
      generateMerkle = async (e) => {
        e.preventDefault();
        console.log("Generating Merkle");
        await Election.methods
        .createMerkleArray()
        .send({ from: await this.state.accountList[this.state.account], gas: 4000000 }).then((receipt) => {
          console.log(receipt);
        });
      }
      
     
    
    
      //***************** BUGGY ************************ */
    getHashBinary = (event) => { 
      console.log('getHashBinary called \n');
      const file = event.target.files[0];
      console.log('files: ' + file);
 //   this.blobToBuffer(event.target.files[0]);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.addEventListener('load', (e) => {
        const buffer = reader.result;
        const bufferLength = buffer.length;
        console.log("Data loaded successfully");
   //     const data = reader.result.slice(reader.result.)
        console.log("Reader Loaded.\n")
        console.log("Buffer Length: " + buffer.byteLength);
        var binArray = new Uint8Array(buffer);
       // var binArray = new Uint8Array(buffer.slice(),8);
        console.log("binArray length : " + binArray.length)
        //var binaryString = String.fromCharCode.apply(null,binArray) ;
        //console.log("binaryString: " + binaryString);

        this.setState({hashBinary: binArray/*CHANGED*/});
      });
      reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100;
          console.log(`Progress: ${Math.round(percent)}`);
        }
      });
        // The file's text will be printed here
       // console.log(this.sate.hashBinary);
    //reader.readAsBinaryString(file);
    }
    
}
export default withRouter(VoteKeyGeneratorForm)