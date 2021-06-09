import '../assets/css/Login-Form-Dark.css';
import '../assets/css/styles.css';
import {Component, useEffect, useState} from 'react';
import { voteKeyGenerator, zkProvider}  from './zkProvider';
import { Accounts, Election, web3 } from "./web3_utility";
import { withRouter } from 'react-router-dom';
import {initialize, metadata } from 'zokrates-js';

class VoteKeyGeneratorForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            secretKey: "Secret Key",
            voteKey: "",
            voteKeyGenerator: null,
            hashBinary: null,
            zokFile: null
          };
          this.handleChange = this.handleChange.bind(this);
          this.generateVoteKey = this.generateVoteKey.bind(this);
          this.getHashBinary = this.getHashBinary.bind(this);
          this.getZokFile = this.getZokFile.bind(this);
          this.compileZok = this.compileZok.bind(this);
        }
   handleChange = (e) => {
    const val  = e.target.value;
    this.setState({
      [e.target.name]: val
    });
    console.log('State: ' + e.target.name + ' Value:' + val);
    };
    generateVoteKey = (e) => {
      e.preventDefault();
      console.log(this.state.secretKey);
      console.log(this.state.hashBinary);
      const sk = this.state.secretKey;
      let vk;
      initialize().then((zkProvider) => {
        
        let hashABI = {
          "inputs": [
            {
              "name": "alpha",
              "public": true,
              "type": "array",
              "components": {
                "size": 2,
                "type": "field"
              }
            }
          ],
          "outputs": [
            {
              "type": "field"
            }
          ]
        };
        //@TODO: Convert hashABI into direct JSON read
        console.log("Computing Witness fo")
        console.log("COMPILER ZOK-JS: " + metadata.version)
        let { witness, output } = zkProvider.computeWitness(this.state.voteKeyGenerator, [["1337","0"]]);
        console.log("Witness:" + witness);
        console.log("Output: " + output);
        vk = output;
      });
 //    let vk = zkProvider.computeWitness(this.state.hashBinary, this.state.secretKey);
    // let vk = MiMCHash(sk);
      this.setState({voteKey : vk});
      console.log("Your vote key is: " + vk);

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
        await Election.methods
          .generateVoteKey(this.state.voteKey)
          .send({ from: Accounts[0], gas: 400000 });
       
          console.log("End of Conduct \n");
    }
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
    compileZok = (e) => {
      e.preventDefault();
      console.log(this.state.zokFile);
      console.log(zkProvider);
      this.setState({voteKeyGenerator: zkProvider.compile(this.state.zokFile)});
      console.log("artifact compiled: " + this.state.voteKeyGenerator);
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
                          <li className="nav-item"><a className="nav-link active" href="/conductElection.html" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Conduct Election</a></li>
                          <li className="nav-item"><a className="nav-link" href="/generateVoteKey.html"  style={{color: 'var(--bs-yellow)', fontFamily: '"Alfa Slab One", serif'}}>Generate Vote Key</a></li>
                          <li className="nav-item"><a className="nav-link" href="/submitVote" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Submit Vote</a></li>
                          <li className="nav-item" />
                        </ul>
                      </div>
                    </div>
                  </nav>
                  <form method="post" id="VoteKeyGenerationForm">
                    <h2 className="visually-hidden">Vote Key Generation Form</h2>
                    <div className="illustration"><i className="icon ion-ios-locked-outline" /></div>
                    <div className="mb-3" />
                    <div className="mb-3"><input className="form-control" type="password" id="secretKey" name="secretKey" onChange = {this.handleChange} placeholder="Enter a Secret Key" /></div>
                    <input type="file" id="fileGetter_Hash" onChange={this.getZokFile}></input>        <input type="file" id="fileGetter_Hash" onChange={this.getHashBinary}></input>
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type="submit" onClick= {this.compileZok}>Compile </button></div>
                    
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type="submit" onClick= {this.generateVoteKey}>Generate Vote Key</button></div>
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type="submit"  onClick= {this.submitVoteKey}>Submit Vote Key</button></div>
                    
                    <a className="forgot" href="/conductElection.html">Want to start your own election?</a>
                  </form>
                </section>
              </div>
            );
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