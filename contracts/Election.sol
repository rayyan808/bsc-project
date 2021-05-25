pragma solidity ^0.8.0;

import "../contracts/MiMC.sol";
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
        uint voteCount;
    }
    /* Each address in Address Space is mapped to an empty Voter struct with default values */
    struct Voter {
        uint value; //Default value is 0 
        bool authorized; 
        bool voted;//Default value is false
        bool submittedVoteKey;
    }
    struct VoteKey {
        uint256 value;
        bool modified;
    }
    string public name;
    address public owner;
    uint public activeVoters;
    string public currentState;
    // Key: Address, Value: Voter 
    //i.e Map a Voter object to ALL addresses
    mapping(address => Voter) voters;
    mapping(address => VoteKey) voteKeys;

    VoteKey[] internal voteKeyArray;
    uint256[]  public  merkleArray;
    Candidate[] public candidates;
    

    uint public terminateElection;
    /* Everytime the stage transitions, an announcement is made to all suscribers.
    STATES: VOTEKEY-GENERATION => VOTE => END */
    event AnnounceNewStage(string stage);
    /* Everytime a vote is executed, this event is logged onto the block. Currently the voters public address is shown next to the candidate they voted
    for, in future updates this address will be replaced by a ZKP */
    event AnnounceVote(string candidate, address proofOfMembership);
    /* Emit an event every time a vote tally is called. (DEBUG) */
    event AnnounceResult(string candidate, uint tallyCount);
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
    There should be a Nth power of 2 length of valid vote keys, if such a case does not exist dummy values are pumped. */
    function createMerkleArray() private {
        /* Guarantee that a valid merkle tree can be constructed with the given nodes*/
        assert(voteKeyArray.length >= 2);
        uint pow = 1; bool isPowerOf2 = false;
        /* Find the power of 2 closest or equal to the length, if equal do nothing */
        while(pow <= voteKeyArray.length){ if(pow == voteKeyArray.length) { isPowerOf2 = true; break; } else { pow = pow *2; } }
        /* If index isn't a power of two, we pump it with static public vote keys */
        while(pow != voteKeyArray.length && isPowerOf2 == false){ voteKeyArray.push((VoteKey(1337, true))); pow--; }
        /* For each voteKey struct present, transfer the hashed value into the Merkle Array */
        for(uint i =0; i < voteKeyArray.length; i++){
            //leaf = MiMC.MiMC_Hash([voteKeyArray[i],voteKeyArray[i+1]]);
            merkleArray.push(voteKeyArray[i].value);
        }
        uint nodeCount=0;
        uint n = voteKeyArray.length;
        /* While there are still nodes to traverse*/
          while (n > 0) {
            /* Each iteration covers one layer of the tree. Starting with the original voteKey values */
            for (uint offset = 0; offset < n - 1; offset+=2) {
                /* Pair-hash neighbouring nodes and move forward by two steps*/
                uint256[] memory x;
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
        }
        /* merkleArray now contains all nodes, ordered by indexing of layer size. i.e 8 voteKeys => index [0..7], 4 parent nodes produced => index [8..11], 2 nodes produced => index [12..13], Merkle Root => index [14]*/
        currentState = "VOTING-OPEN";
        emit AnnounceNewStage(currentState); 
    }
    /* Use Case (DApp)
    When a user inputs a secret key (SK) and clicks the 'Join Vote' button,
    SK is locally hashed using MiMC before being sent as a VOTE KEY*/
    function pushVoteKey(uint256 voteKey) public {
        /* check double-vote and if votekey generation stage is active*/
       // require(currentState == "VOTEKEY-GENERATION");
        /* Make sure the voter has been authorized and that they haven't already generated a key*/
        require(voters[msg.sender].authorized == true && voters[msg.sender].submittedVoteKey == false);
        /* Mapping Implementation */
        voteKeys[msg.sender].value = voteKey;
        voteKeys[msg.sender].modified = true;
        /* Array Implementation */
        voteKeyArray.push(VoteKey(voteKey, true));
        activeVoters++;
        /* Check if our voter count exceeded or reached a power of 2*/
        if(activeVoters >= 2) { 
          //  generateMerkleTree(); 
            }
    }   
    function conductElection(string memory inputName, uint8 treeDepth, string memory candidateA, string  memory candidateB) public  {
        require(treeDepth >= 1 && treeDepth <= 33); //33 is the maximum depth of the tree allowed
        
        owner = msg.sender;
        name = inputName;
        candidates.push(Candidate(candidateA,0));
        candidates.push(Candidate(candidateB,0));
        currentState = "VOTEKEY-GENERATION";
        emit AnnounceNewStage(currentState);
    }
     /* Inputs: voteVal, Proof of Membership */
     function submitVote(uint voteVal) public {
         /*Verify if Voting process is active*/
        //require(currentState == "VOTING-OPEN");
    	/* Verify Voter rights and if they have voted previouslys*/
        require(voters[msg.sender].authorized == true);
        require(voters[msg.sender].voted == false);
        /* Invoke the Verifier contract with Proof of Membership as input */
            //Assign Vote Value to the voter
            voters[msg.sender].value = voteVal;
            //If the voter is authorized, then the vote has a state change
            /* @TODO: Implement Additive Pailler */
          //  candidates[voteVal].voteCount += voters[msg.sender].rights;
            /* Emit an event on the block to notify a new vote using candidate who got the votes name and the voters proof of Membership*/
            emit AnnounceVote(candidates[voteVal].name, msg.sender);
            activeVoters--;
            if(activeVoters == 0){ currentState = "END"; }
        
    } 
   // function generateMerkle() private {
        /* We already have the H1 of each secretKey as a VoteKey 
        Now, we must take pairs and hash with eachother*/
        //for(uint i =0; i < voteKeyArray.length; i++){
            
       // }
   // } 
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
        emit AnnounceResult(candidates[0].name, candidates[0].voteCount);
        emit AnnounceResult(candidates[1].name, candidates[1].voteCount);
    }
    /* Here will be the custom weight function responsible for calculating a vote weight
    based on User financial investment or something similar */
    function calculateVoteWeight(address citizen) private {
        /* (TEMPORARY) HARD-CODED VALUE OF 1 */
        voters[citizen].value = 1;
    }
    function testHash(uint256[] memory alpha) public pure returns(uint256) {
        uint256 hashed = MiMC.MiMC_Hash(alpha);
       // emit Debug(hashed);
        return hashed;
    }
}
