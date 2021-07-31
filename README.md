ZERO-KNOWLEDGE VOTING SYSTEM USING TRUFFLE, ZOKRATES.JS, GANACHE & REACT-JS 


HOW TO INSTALL:
Blockchain Components:
Install your local blockchain (Ganache, Ganache-CLI, TestRPC..) then
from the project root: 
`npm install` - Install deps 
`npm install -g truffle` - Install truffle

DAPP
`cd dapp` - Navigate to DAPP root
`yarn install` - Install deps


HOW TO RUN:

Blockchain:
`ganache-cli --port 7454` - Run your local blockchain, we used ganache. 

The port specifications are configured within the `truffle-config.js` file in the project root directory. We explicitly define `7454` as ganache uses `8454` be default. This may be changed.

`truffle deploy` - Deploy the ZK Voter and it's libraries to the aforementioned blockchain.

(Note the log that follows after deployment. Copy the `contract address` provided under the Election Contract, we will use it in the DApp setup)
DApp:
Prerequisite: We have not added a config file that may be read yet, so you must manually obtain the Election deployment address (see previous section) and paste it into the `ELECTION_ADDRESS` variable within `/dapp/src/assets/contracts/ElectionAbi.js`. (Note: If you alter the Election contract, you must re-compile via `truffle compile` and paste the new JSON ABI found within `build/contracts/Election.json`)


`cd dapp` - Navigate to the DApp directory
`yarn start` - Start up the DApp

HOW TO TEST:
`truffle develop` - Enter a development environment 
Run `truffle test` from the project root directory. This will spool a local development blockchain for you and conduct the tests which can be evaluated at `/test/electionTest.js/`

Assets: Due to a bug in Zokrates-JS I found (see: https://github.com/Zokrates/ZoKrates/issues/909), we must unfortunately locate and compile the zero-knowlege circuits ourselves instead of directly loading pre-compiled binaries. All the required assets are located within the DApp/snarks/client-side.

Vote-Key Generation: You need to open the ZK circuit at: `/dapp/snarks/client-side/combinedCircuit.zok`

Submitting Vote/Proof Generation: You need to open the ZK circuit at `membershipTest.zok`.

Once Zokrates-JS includes the PR from issue 909 into their next release, compilation can be disregarded in favour of pre-compile binaries. Though self-compilation is exhausting, it does show the true transparency of zero-knowledge proofs, and can provide valuable learning insight to users on the functionality within the source-code.

In-Progress:
NOTE: Authorize address is disabled for debugging, the final release will contain the ability to authorize node addresses when conducting the election. 
BONUS: >>> Improve the ZK circuit from 3 layers to dynamic layers using Zokrates Generic Functions <<<<
BONUS: >>> Upgrade to Truffle Beta and utilize Revert Messages for better User clarification on incorrect method calls <<<
BONUS: >>> Improve UI <<<
Rough work log:
- Studied Zokrates Docs
- Studied EVM Docs (Skimmed through, more like)
- Studied Soldiity Docs
- Research complete on Membership Test
- Alpha Code for Membership Test 
- Simple Election Contract with voting and tallying.
- A seperate Merkle contract that is just a mind doodle at this point
- Research on Hash Functions suitable for SNARK and On-Chain use
- On-Chain MiMC Hashing implemented
- Zero-Knowledge MiMC Hashing implemented
- Both MiMC Hash functions synchronized to produce same output (FINALLY!)
- Merkle Generation implemented
- Proof of Membership using ZKP MiMC implemented
- A little insight gained in arithmetic circuits 
- Proof of Membership tested and optimized for circuits (removed some if conditions, removed generic properties such as dynamic tree size due to circuit constraints)
- Verifier Contract produced
- DApp UI
- DApp Conduct Election
- DApp Generate Vote Key (found bug in Zokrates-JS for pre-compiled CLI binaries)
- Dapp Submit Vote (found bug in Zokrates-JS for runtime proof generation)
- Merkle Array functioning as it should

- Solve Dapp Submit Vote bug found in Zokrates-JS
- Add Nullifier 
- Ditched Homomorphic Encryption in favour of simpler disasociation method
- Vote value included within ZK-SNARK
- Tests added
- Readme made more clear

