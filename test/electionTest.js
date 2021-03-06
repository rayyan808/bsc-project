const Election = artifacts.require("Election");
require('chai')
    .use(require('chai-as-promised'))
    .should();

const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
/*const initialize  = require('zokrates-js');
let compiler, computeWitness, zkProvider, generateProof, verifier;
const iniZokrates = () => {
    initialize().then((zk) => {
      zkProvider = zk;
      compiler = zk.compile;
      computeWitness = zk.computeWitness;
      generateProof = zk.generateProof;
      verifier = zk.verify;
    });
  }*/
contract("Election", async (accounts) => {
    describe("Testing Election Conduction", () => {

        it("Stores correct candidates", async () => {

    const election = await Election.deployed();
            let result = await election.conductElection("testElection", "Trump", "Kim Jong-Un", {from: accounts[0]});
            let A = await election.candidates(0);
            let B = await election.candidates(1);
                
            A.toString().should.equal("Trump");
            B.toString().should.equal("Kim Jong-Un");
        });
        it("Gets candidate information correctly", async () => {
            const election = await Election.deployed();
            let result = await election.getTally();
            assert.equal(result[0].name, "Trump");
            assert.equal(result[1].name, "Kim Jong-Un");
        });
        it("Stores correct Election name", async () => {

    const election = await Election.deployed();
            let name = await election.name();
            name.toString().should.equal("testElection");
        });
        it("Authorizes node addresses correctly", async () => {

        const election = await Election.deployed();
        for(var i =0; i < 4; i++){
            await election.authorize(accounts[i], {from: accounts[0]});
            let authorization = await election.voters(accounts[i]);
            authorization.authorized.should.equal(true);
            }   
        });
    })
    describe("Testing Vote Keys", async () => {

        it("Rejects an unauthorized node address", async () => {
            const election = await Election.deployed();
            await truffleAssert.reverts(election.pushVoteKey("1234", {from: accounts[4]}));
        });

        it("Stores correctly", async () => {
            const election = await Election.deployed();
            var voteKeys = [
                "279068567919286272405494692370356718356607598444672844562570709048854917873",
                "19853509215178435906716469440873614721263411410499278547942821068637929368169",
                "3181560448192751507953874194505803391543481713828825018922585520393189659867",
                "1185539502319573937128868532294662895325164579063707179200953957722766982281"
            ];
            for(var i=0; i < 4; i++){
                await election.pushVoteKey(voteKeys[i],{from: accounts[i]});
                let result = await election.voteKeyArray(i);
                result.toString().should.equal(voteKeys[i]);
            }
        });
    });
    describe("Testing Merkle Tree", async () => { 
        it("Calculates correct Merkle Root", async () => {

            const election = await Election.deployed();
            let result = await election.merkleRoot();
            result.toString().should.equal("5060062225424388734389759152160062682747827599832181989797835757669867179676")
        
        });
    });

 /* NOTE: I could not find a method to test the Verifier contract within the ZK infrastructure, for assertions/tests on the Verification contract 
 * you may consult the Zokrates GitHub Repo. A Chai test would require the raw binary outputs of the 
 Proof (A Proof on it's own is a few hundred MBs, supplying it within the parameters seemed chaotic. Regardless, we have provided tests that our 
 * system provides the correct information needed by a client for proper conduct. The Zero-Knowledge tests can be found in zeroKnowledge.js  */


    
});



