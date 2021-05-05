pragma solidity ^0.8.4;


/* PERSONEL NOTES:
Each invokation will cost Gas (measured in computational steps), the transaction
of incrementing a candidate vote and losing right to vote (again) is

/* We can pre-generate a proof of membership circuit in Zokrates using a Merkle Tree with all public keys as an input. A user may prove that
he is a member of the tree via the Merkle Root rt. 

/* @TODO: Merkle Tree Generator, input values into zok file
Proving membership: 
Inputs => Public merkleRoot, treeDepth, Private uint[] directionNavigator, currentNode, 

User Inputs into Proof Generation => Private secretKey

Owner Inputs => Self generated Secret Key and Public Key, and Verification Key
When contract is deployed, the state change is appended onto the blockchain. */
contract Election {
    /* Structs are just syntatic sugar in the EVM compiler
    when referencing, treat getter return as an array i.e candidate[0].toString() returns 'Donald Trump' */
    struct Candidate {
        string name;
        uint voteCount;
    }
    struct Voter {
        uint value;
        uint rights;
        bool voted;
    }
    uint public candidateAVotes;
    uint public candidateBVotes;
    address public admin;
    string public name;
    address  public owner;
    // Key: Address, Value: Voter 
    //i.e Map a Voter object to ALL addresses
    /* EVM generates getter/setter for public variables,
    Voter/Candidate structs returned as array. */
    mapping(address => Voter) public voters;
    
    Candidate[] public candidates;
    
    uint public terminateElection;
    
    event AnnounceResult(string candidate, uint tallyCount);
    /* Called only when contract is created, contract compiler is the owner */
    constructor(){
        owner = msg.sender; 
    }
    modifier ownerPrivilage(){
        require(msg.sender == owner);
        _;
    }
    /* Vote is invoked by owner
    All variables are passed as memory as this should remain local to the owners node during execution
    The owner must input a list of addresses that maintain a right to vote. Later, this input should be replaced
    with a verification key */
    function conductElection(string memory inputName, string memory candidateA, string memory candidateB, address[] memory authorizedVoters) public {
        owner = msg.sender;
        name = inputName;
        candidates.push(Candidate(candidateA,0));
        candidates.push(Candidate(candidateB,0));
        for(uint i = 0; i < authorizedVoters.length; i++){
            authorize(authorizedVoters[i]);
        }
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
        
    }
   // function proveMembership)
    /* The invoker of the Election can convert 'citizens' into 'voters' by giving the rights variable
    / value that affects the summation in submitVote(..)*/
    function authorize(address citizen) private {
        require(msg.sender == owner);
        voters[citizen].rights = 1;
        
    }
    function tallyVotes() public {
    	/* @TODO: Add a loop for dynamic candidates*/
        emit AnnounceResult(candidates[0].name, candidates[0].voteCount);
        emit AnnounceResult(candidates[1].name, candidates[0].voteCount);
    }

}
