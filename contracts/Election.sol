pragma solidity ^0.8.0;


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
contract Election {
    struct Candidate {
        string name;
        uint voteCount;
    }
    struct Voter {
        uint value;
        uint rights;
        bool voted;
    }
    string public name;
    address public owner;
    // Key: Address, Value: Voter 
    //i.e Map a Voter object to ALL addresses
    mapping(address => Voter) voters;
    
    Candidate[] public candidates;
    
    uint public terminateElection;
    /* Everytime a vote is executed, this event is logged onto the block. Currently the voters public address is shown next to the candidate they voted
    for, in future updates this address will be replaced by a ZKP */
    
    event AnnounceVote(string candidate, address proofOfMembership);
    event AnnounceResult(string candidate, uint tallyCount);
    
    event AnnounceAuth(address authorizedUser);
    /* Called only when contract is created, contract compiler is the owner */
    constructor(){
        owner = msg.sender;
    }
    function conductElection(string memory inputName, string memory candidateA, string  memory candidateB) public  {
        owner = msg.sender;
        name = inputName;
        candidates.push(Candidate(candidateA,0));
        candidates.push(Candidate(candidateB,0));
        
    }
     /* Inputs: voteVal, */
     function submitVote(uint voteVal) public {
         //Index/address is contained in msg.sender
    	
        require(voters[msg.sender].rights == 1);
        require(voters[msg.sender].voted == false);
        
        //Assign Vote Value to the voter
        voters[msg.sender].value = voteVal;
        //If the voter is authorized, then the vote has a state change
        /* @TODO: Implement Additive Pailler */
        candidates[voteVal].voteCount += voters[msg.sender].rights;
        /* Emit an event on the block to notify a new vote using candidate who got the votes name and the voters proof of Membership*/
        emit AnnounceVote(candidates[voteVal].name, msg.sender);
    }
    /*function generateMerkle(){
    }*/
    /* The invoker of the Election can convert 'citizens' into 'voters' by giving the rights variable
    / value that affects the summation in submitVote(..)*/
    function authorize(address citizen) public {
        require(msg.sender == owner);
        voters[citizen].rights = 1;
        emit AnnounceAuth(msg.sender);
        
    }
    function tallyVotes() public {
    	/* @TODO: Add a loop for dynamic candidates*/
        emit AnnounceResult(candidates[0].name, candidates[0].voteCount);
        emit AnnounceResult(candidates[1].name, candidates[1].voteCount);
    }

}
