/**************************** CLIENT-SIDE ************************************************/


const { initialize } = require('zokrates-js/node');
/****************** DEBUG *********************/
const SECRET_KEY = 1337;

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

/** ZOKRATES-JS**/
initialize().then((zokratesProvider) => {
    /* Sy chronously read the file before execution persists*/
    var fs = require('fs');

    try {
        var data = fs.readFileSync('/snarks/hashTest.zok', 'utf8');
        console.log("Zokrates file read. \n");    
    } catch(e) {
        console.log('Error:', e.stack);
    }

    // compilation
    const artifacts = zokratesProvider.compile(data);

    // computation
    /* Test witness using SECRETKEY*/
    const { witness, output } = zokratesProvider.computeWitness(artifacts, ["1337", "0"]);

    // run setup
    const keypair = zokratesProvider.setup(artifacts.program);

    // generate proof
    const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

    // export solidity verifier
    //const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
});



let {a,b } = await Election.deployed().then(func(instance) { instance.getMerkleInfo(accounts[i])})
