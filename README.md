THE FIRST ZERO-KNOWLEDGE & TRULY DECENTRALIZED VOTING SYSTEM USING ETHEREUM, TRUFFLE, ZOKRATES.JS & REACT-JS 

This proposal is showcasing the ability to deploy a voting system on blockchain with minimal computational overhead such that is becomes browser-friendly. This is mainly done by scrapping traditional additive homomorphic voting schemes in favour of a zero-knowledge SNARK
proof of membership. The lightweight library of Zokrates-JS allows us to use an ES6 module within our react script to perform zero-knowledge operations. This is coupled with a Web3 library to communicate the zero-knowledge proofs with the Election Contract. Unlike other proposals, this project doesn't require a Trusted Authority for Tally decryption as it exploits the disassociation between a voter and their SNARK-proof (Vote Ballot) to pass the vote value whilst utilizing Unique Identifiers to provide self-verifiability of vote process completion. 

"True Decentralized voting using blockchain and zero-knowledge proofs"- Rayyan Jafri, Faculty of Science & Engineering, The University of Groningen, The Netherlands

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
`ganache-cli` - Run your local blockchain, we used ganache. 

The port specifications are configured within the `truffle-config.js` file in the project root directory. 

`truffle deploy` - Deploy the ZK Voter and it's libraries to the aforementioned blockchain.

(Note the log that follows after deployment. Copy the `contract address` provided under the Election Contract, we will use it in the DApp setup)
DApp:
Prerequisite: We have not added a config file that may be read yet, so you must manually obtain the Election deployment address (see previous section) and paste it into the `ELECTION_ADDRESS` variable within `/dapp/src/assets/contracts/ElectionAbi.js`. (Note: If you alter the Election contract, you must re-compile via `truffle compile` and paste the new JSON ABI found within `build/contracts/Election.json`)


`cd dapp` - Navigate to the DApp directory
`yarn start` - Start up the DApp

HOW TO TEST:
==> Blockchain Component

`truffle develop` - Enter a development environment 
Run `truffle test` from the project root directory. This will spool a local development blockchain for you and conduct the tests which can be evaluated at `/test/electionTest.js/`

==> Zero-Knowledge Circuits

`cargo test` - Run a cargo test 

`./snarks/test/` - Test Directory

====> DEVELOPER NOTES <======

Assets: Due to a bug in Zokrates-JS I found (see: https://github.com/Zokrates/ZoKrates/issues/909), we must unfortunately locate and compile the zero-knowlege circuits ourselves instead of directly loading pre-compiled binaries. All the required assets are located within the DApp/snarks/client-side.

Vote-Key Generation: The Vote-Key is a hash combination of your Secret Key and your chosen Unique Identifier. To compute a hash, you must open the ZK circuit at: `/snarks/client-side/hashFunction.zok`

Submitting Vote/Proof Generation: In order to prove your membership and generate a proof, you need to open the ZK circuit at: `/snarks/client-side/membershipTest.zok`.

Once Zokrates-JS includes the PR from issue 909 into their next release, compilation can be disregarded in favour of pre-compile binaries. Though self-compilation is exhausting, it does show the true transparency of zero-knowledge proofs, and can provide valuable learning insight to users on the functionality within the source-code.

Future additions (If I find the the time, feel free to create a PR):
BONUS: >>> Improve the ZK circuit from 3 layers to dynamic layers using Zokrates Generic Functions <<<<
BONUS: >>> Upgrade to Truffle Beta and utilize Revert Messages for better User clarification on incorrect method calls <<<
BONUS: >>> Make UI Responsive <<<
BONUS: >>> Add Error UI Pop-Ups <<<

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

