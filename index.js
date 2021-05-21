const Web3 = require('web3');
var Election = artifacts.require("Election");
const customProvider = {
    sendAsync : (payload, cb) => {
        console.log('Called:');
        console.log(payload);
        cb(undefined, 100);
    }
}
const web3 = new Web3('http://localhost:7545');

let {a,b } = await Election.deployed().then(func(instance) { instance.getMerkleInfo(accounts[i])})