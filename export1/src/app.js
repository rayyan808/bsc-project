
var fs = require('fs');
const { initialize } = frequire('zokrates-js');

const zkProvider,voteKeyGenerator, membershipTest;
const displayReceipt = async (greeting, contract) => {
    greeting = await contract.methods.sayHello().call();
    $("transactionResult").html(greeting);
  };
  async function iniDApp() 
  {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const contract = await getContract(web3);
    iniZokrates();
    conductElection(contract, accounts);
    generateVoteKey(contract, accounts);
  }  

  const conductElection = (contract, accounts) => {
    let name, candidateA, candidateB;
    $("#name").on("change", (e) => {
      name = e.target.value;
    });
    $("#candidateA").on("change", (e) => {
        candidateA = e.target.value;
      });
      $("#candidateB").on("change", (e) => {
        candidateB = e.target.value;
      });
    $("#conductElectionForm").on("submit", async (e) => {
      e.preventDefault();
      await contract.methods
        .conductElection(name, candidateA, candidateB)
        .send({ from: accounts[0], gas: 40000 });
    });
  };

  const generateVoteKey = (contract, accounts) => {
      let secretKey;
      $("#secretKey").on("change", (e) => {
        secretKey = e.target.value;
      });
    $("#VoteKeyGenerationForm").on("submit", async (e) => {
      e.preventDefault();
      let voteKey; // = the output to zokrates witness computation;
      const { witness, output } = zkProvider.computeWitness(voteKeyGenerator, [secretKey,"0"]);
      voteKey = output;
      console.log("Locally Generated VoteKey: " + voteKey);
      await contract.methods
        .generateVoteKey(voteKey)
        .send({ from: accounts[0], gas: 40000 });
    });
  }

  const getCandidateList = (contract) => {
      /* Candidate List should be returned as JSON?*/
      const candidateList = await contract.methods.getCandidateList.call();
      var card = $('#card');

      for (i = 0; i < candidateList.length; i ++) {
        card.find('.card-title').text(candidateList[i].name);
        card.find('img').attr('src', 'assets/img/bitcoinMeme.jpg');
        card.find('.card-text').text('Candidate ID: ' + candidateList[i].index);

        petsRow.append(card.html());
      }
    });
  

  /// ************* ZERO-KNOWLEDGE ****************//
  const iniZokrates = () => {  
    initialize().then((zokratesProvider) => {
    zkProvider = zokratesProvider;
    // 
    try {
    voteKeyGenerator = fs.readFile('snarks/hashTestBinary'); /* Load Binary */;
    } catch(e) {
      console.log('Error loading voteKeyGeneratorBinary:', e.stack);
    }
    try {
      membershipTest = fs.readFile('snarks/membershipTestBinary'); /* Load Binary */;
      } catch(e) {
        console.log('Error loading MembershipTestBinary: ', e.stack);
      }
    // computation

    const { witness, output } = zokratesProvider.computeWitness(voteKeyGenerator, ["2"]);

    // run setup
    const keypair = zokratesProvider.setup(artifacts.program);

    // generate proof
    const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

    // export solidity verifier
    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
});
  }