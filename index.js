const { initialize } = require('zokrates-js/node');

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
    const source = "def main(private field a) -> field: return a * a";

    // compilation
    const artifacts = zokratesProvider.compile(source);

    // computation
    const { witness, output } = zokratesProvider.computeWitness(artifacts, ["2"]);

    // run setup
    const keypair = zokratesProvider.setup(artifacts.program);

    // generate proof
    const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

    // export solidity verifier
    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
});



let {a,b } = await Election.deployed().then(func(instance) { instance.getMerkleInfo(accounts[i])})
