pragma solidity ^0.8.0;


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
    string  public owner;
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
        owner = string(msg.sender);
        
    }
    function conductElection(string memory inputName, string memory candidateA, string memory candidateB) public {
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
        
    }
   // function proveMembership)
    /* The invoker of the Election can convert 'citizens' into 'voters' by giving the rights variable
    / value that affects the summation in submitVote(..)*/
    function authorize(address citizen){
        require(msg.sender == owner);
        voters[citizen].rights = 1;
        
    }
    function tallyVotes() public view returns (uint candidateAResult, uint candidateBResult) {
    	/* @TODO: Add a loop for dynamic candidates*/
        AnnounceResult(candidates[0].name, candidateAVotes);
        AnnounceResult(candidates[1].name, candidateBVotes);
    }

}
