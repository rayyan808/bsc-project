const fs = require('fs');
const { initialize } = require('zokrates-js');

let zkProvider, voteKeyGenerator, membershipTest;
 /// ************* ZERO-KNOWLEDGE ****************//
 const iniZokrates = () => {  
    initialize().then((zokratesProvider) => {
    zkProvider = zokratesProvider;
    // 
    try {
    voteKeyGenerator = fs.readFile('../snarkBinaries/hashTestBinary');/* Load Binary */;
    } catch(e) {
      console.log('Error loading voteKeyGeneratorBinary:', e.stack);
    }
    try {
      membershipTest = fs.readFile('../snarkBinaries/membershipTestBinary'); /* Load Binary */;
      } catch(e) {
        console.log('Error loading MembershipTestBinary: ', e.stack);
      }
    // computation

    const { witness, output } = zokratesProvider.computeWitness(voteKeyGenerator, ["2"]);

    // run setup
  //  const keypair = zokratesProvider.setup(artifacts.program);

    // generate proof
  //  const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

    // export solidity verifier
  //  const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
});
}

export { zkProvider, voteKeyGenerator, membershipTest}