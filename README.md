My Bachelor Project


HOW TO RUN:
Run your local blockchain (Ganache, Ganache-CLI, TestRPC..) then
from the project root: npm install, truffle deploy

from dapp root: yarn install, yarn start 

Make sure to keep the inspection tab open whilst using the website in order to recieve information on current async processes. (F12 for Google Chrome)

Assets: Due to a bug in Zokrates-JS I found (see: https://github.com/Zokrates/ZoKrates/issues/909), we must unfortunately locate and compile the zero-knowlege circuits ourselves. All the required assets are located within the DApp/snarks/client-side

Vote-Key Generation: You need to open the 'combinedCircuit.zok'

Submitting Vote/Proof Generation: You need to open the 'membershipTest.zok' file. 

Once Zokrates-JS includes the PR from issue 909 into their next release, compilation can be disregarded in favour of pre-compile binaries. Though self-compilation is exhausting, it does show the true transparency of zero-knowledge proofs, and can provide valuable learning insight to users on the functionality within the source-code.

In-Progress:
>>>>> Test Merkle Adjustment Function <<<<<
>>>>> Test Verifier Contract <<<<<
>>>>> Develop Tests for all contracts <<<<
BONUS: >>> Improve the ZK circuit from 3 layers to dynamic layers using Zokrates Generic Functions <<<<

Progress:
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


