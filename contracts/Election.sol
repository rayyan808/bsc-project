pragma solidity ^0.8.0;

import "./MiMC.sol";
import "./verifier.sol";
import "./utility.sol";
/* PERSONEL NOTES:
Each invokation will cost Gas (measured in computational steps), the transaction
of incrementing a candidate vote and losing right to vote (again) is
 STORAGE -> STATE VARIABLES
 MEMORY -> LOCAL VAR WITHIN function
 CALLDATA -> ONLY WITHIN PARAM 
/* We can pre-generate a proof of membership circuit in Zokrates using a Merkle Tree with all public keys as an input. A user may prove that
he is a member of the tree via the Merkle Root rt. 

/* @TODO: Merkle Tree Generator, input values into zok file
Proving membership: 
Inputs => Public merkleRoot, treeDepth, Private uint[] directionNavigator, currentNode, 

User Inputs into Proof Generation => Private secretKey

Owner Inputs => Self generated Secret Key and Public Key, and Verification Key
When contract is deployed, the state change is appended onto the blockchain. */
/*struct MerkleTree {
    string value;
    MerkleTree left;
    MerkleTree right;

}*/


contract Election {
    struct Candidate {
        string name;
        uint[] votes; /* A list of encrypted vote values for this candidate */
    }
    /* Each address in Address Space is mapped to an empty Voter struct with default values */
    struct Voter {
        bool authorized; /* So an owner has control over which public addresses may invoke functions */
        bool submittedVoteKey; /* So we can prevent multiple voteKeys from one address */
        uint weight; /* The on-chain calculated weight of the voter*/
    }
    string public name;
    address public owner;
    uint public activeVoters;
    //@TODO: Convert state variable to enum or int for comparison in require
    string public currentState;
    // Key: Address, Value: Voter 
    //i.e Map a Voter object to ALL addresses
    mapping(address => Voter) voters;
    uint256[] internal voteKeyArray;
    uint256[] internal merkleArray;
    string[] public publicKey;
    Candidate[] public candidates;
    uint256 public merkleRoot;
    /* The election starters public key */
    uint public terminateElection;
    /* Everytime the stage transitions, an announcement is made to all suscribers.
    STATES: VOTEKEY-GENERATION => VOTE => END */
    event AnnounceNewStage(string stage);
    /* Everytime a vote is executed, this event is logged onto the block. Currently the voters public address is shown next to the candidate they voted
    for, in future updates this address will be replaced by a ZKP */
    event AnnounceVote(string candidate, address proofOfMembership);
    /* Emit an event every time a vote tally is called. (DEBUG) */
    event AnnounceResult(string candidate, uint[] tallyCount);
    /* Create an Event each time the owner authorizes a voter */
    event AnnounceAuth(address authorizedUser);
    event Debug(uint256 s);
    /* Called only when contract is created, contract compiler is the owner */
    constructor(){
        owner = msg.sender;
    }
    /* When a potential voter wishes to generate a proof, they required their index in the Merkle Tree aswell as the Merkle Root*/
 /*   function getMerkleInfo(string memory voteKey) public returns() {

    } */
    /* Once the VOTEKEY-GENERATION period has expired, this function is called to produce a Merkle Tree.
    There should be a Nth power of 2 length of valid vote keys, if such a case does not exist dummy values are pumped. 
    GAS COST EST: 300k */
    function createMerkleArray() public {
        /* Guarantee that a valid merkle tree can be constructed with the given nodes*/
        //assert(voteKeyArray.length >= 2);
        uint pow = 1; bool isPowerOf2 = false;
        uint256 tempValDebug =0;
        /* Find the power of 2 closest or equal to the length, if equal do nothing */
        while(pow <= voteKeyArray.length){ if(pow == voteKeyArray.length) { isPowerOf2 = true; break; } else { pow = pow *2; } }
        /* If index isn't a power of two, we pump it with static public vote keys */
        while(pow != voteKeyArray.length && isPowerOf2 == false){ voteKeyArray.push(1337); pow--; }
        /* For each voteKey struct present, transfer the hashed value into the Merkle Array */
        for(uint i =0; i < voteKeyArray.length; i++){
            //leaf = MiMC.MiMC_Hash([voteKeyArray[i],voteKeyArray[i+1]]);
            emit Debug(tempValDebug);
            tempValDebug = voteKeyArray[i];
            merkleArray.push(tempValDebug);
        }
        uint nodeCount=0;
        uint n = voteKeyArray.length;
        /* While there are still nodes to traverse*/

        uint256[] memory x = new uint[](2); //Should be statically defined
          while (n > 0) {
            /* Each iteration covers one layer of the tree. Starting with the original voteKey values */
            for (uint offset = 0; offset < n - 1; offset+=2) { //Offset is the number of nodes operated on within the scope of the iteration
                /* Pair-hash neighbouring nodes and move forward by two steps*/
                /* Transfer values from the appropiate index (nodes already covered + offset)*/
                x[0] = merkleArray[nodeCount + offset];
                x[1] = merkleArray[nodeCount + offset + 1];
                /* Combine both nodes using MiMC Hash and push to the array as a Parent*/
                merkleArray.push(MiMC.MiMC_Hash(x));
            }
            /* Add the count of this new layer to our total node count*/
            nodeCount += n;
            /* Div2 will get us to the next layer count, due to the nice properties of Binary Trees and Powers of 2 we can just div*/
            n = n / 2;
            if(n <= 0){ //next while wont occur. The offset at this point is the number of nodes in the tree
            }
        }
        /* merkleArray now contains all nodes, ordered by indexing of layer size. i.e 8 voteKeys => index [0..7], 4 parent nodes produced => index [8..11], 2 nodes produced => index [12..13], Merkle Root => index [14]*/
        currentState = "VOTING-OPEN";
        emit AnnounceNewStage(currentState); 
    }
    /* Use Case (DApp)
    When a user inputs a secret key (SK) and clicks the 'Join Vote' button,
    SK is locally hashed using MiMC before being sent as a VOTE KEY
    The user is only able to push 1 vote-key per public address (to prevent double-registration) */
    function pushVoteKey(string memory str) public {
        uint256 voteKey = utility.stringToUint(str);
        /* check double-vote and if votekey generation stage is active*/
       // require(currentState == "VOTEKEY-GENERATION");
        /* Make sure the voter has been authorized and that they haven't already generated a key*/
        //require(/*voters[msg.sender].authorized == true &&*/ voters[msg.sender].submittedVoteKey == false);
        /* Mapping Implementation */
        /* Array Implementation */
        voteKeyArray.push(voteKey);
        activeVoters++;
        /* Check if our voter count exceeded or reached a power of 2*/
        if(activeVoters == 4) { 

            emit Debug(voteKey);
           createMerkleArray();
            }
            emit Debug(voteKey);
    }   
    //@TODO: Add require to prevent multiple pushes
    function pushPublicKey(string memory n, string memory g) public {
        publicKey.push(n); publicKey.push(g);
    }
    function getPublicKey() public view returns(string memory n, string memory g){
        return (publicKey[0], publicKey[1]);
    }
    function conductElection(string memory inputName, uint8 treeDepth, string memory candidateA, string  memory candidateB) public  {
        require(treeDepth >= 1 && treeDepth <= 33); //33 is the maximum depth of the tree allowed
        //publicKey = pubKey; /* Serialization of Public Key class as a string, Client may de-serialize for encryption*/
       // publicKey.push(n); publicKey.push(g);
        owner = msg.sender;
        name = inputName;
        uint256[] memory empty;
        candidates.push(Candidate(candidateA,empty));
        candidates.push(Candidate(candidateB,empty));
        currentState = "VOTEKEY-GENERATION";
        emit AnnounceNewStage(currentState);
    }
     /* Inputs: voteVal, Proof of Membership */
     function submitVote( uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c, uint[1] memory input, uint delegate) public {
    	/* Verify Voter rights and if they have voted previously */
        require(voters[msg.sender].authorized == true, "The owner did not authorize you to vote."); 
        /* @TODO: Replace this with nullifier check */ 
        //require(voters[msg.sender].voted == false, "You have already voted"); 
         /*Verify if Voting process is active*/
        //require(currentState == "VOTING-OPEN");
        /* Verify the Proof of Membership */
        Verifier verifier = new Verifier();
        require(verifier.verifyTx(a, b, c, input));
        /* Invoke the Verifier contract with Proof of Membership as input */
            //Assign Vote Value to the voter
            candidates[delegate].votes.push(voters[msg.sender].weight);
            //If the voter is authorized, then the vote has a state change
            /* Emit an event on the block to notify a new vote using candidate who got the votes name and the voters proof of Membership*/
            emit AnnounceVote(candidates[delegate].name, msg.sender);
            activeVoters--;
            if(activeVoters == 0){ currentState = "END"; }
        
    } 
    function getMerkleInfo(string memory str) public view returns(uint256 targetIndex, uint256 firstLayerSize, uint256 [] memory entireMerkleArray, uint256 mkRoot) {
    	uint index = 1337;
        uint256 voteKey = utility.stringToUint(str);
    	for(uint i =0; i< merkleArray.length; i++){
    		if(voteKey == merkleArray[i]){
    		 index = i;
    		/* From i till N, move up a layer, find appropiate index*/
    		}
    	}
    	require(index != 1337);
    	return (index, voteKeyArray.length, merkleArray, merkleArray[merkleArray.length-1]);
    }
    /* The invoker of the Election can convert 'citizens' into 'voters' by giving the rights variable
    / value that affects the summation in submitVote(..)*/
    function authorize(address citizen) public {
        require(msg.sender == owner);
        voters[citizen].authorized = true;
        calculateVoteWeight(citizen);
        emit AnnounceAuth(msg.sender);
        
    }
    function tallyVotes() public {
    	/* @TODO: Add a loop for dynamic candidates*/
        emit AnnounceResult(candidates[0].name, candidates[0].votes);
        emit AnnounceResult(candidates[1].name, candidates[1].votes);
    }
    /* Here will be the custom weight function responsible for calculating a vote weight
    based on User financial investment or something similar */
    function calculateVoteWeight(address citizen) private {
        /* (TEMPORARY) HARD-CODED VALUE OF 1 */
        voters[citizen].weight = 1;
    }
    /* ====================== WEB3 HELPER GETTERS ====================*/
    function getCandidates() public view returns(string[] memory){
        string[] memory result = new string[](candidates.length);
        for(uint i=0; i<candidates.length; i++){
            result[i]= (candidates[i].name);
        }
        return result;
    }
}
