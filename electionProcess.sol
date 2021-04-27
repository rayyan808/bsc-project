pragma solidity ^0.8.0;


/* PERSONEL NOTES:
Each invokation will cost Gas (measured in computational steps), the transaction
of incrementing a candidate vote and losing right to vote (again) is */
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
    
    address public admin;
    string public name;
    string public owner;
    // Key: Address, Value: Voter 
    //i.e Map a Voter object to ALL addresses
    mapping(address => Voter) public voters;
    
    Candidate[] public candidates;
    
    uint public terminateElection;
    
    event AnnounceResult(string candidate, uint tallyCount);
    /* Called only when contract is created, contract compiler is the owner */
    constructor(){
        owner = msg.sender;
    }
    function conductElection(string inputName, string candidateA, string candidateB)  {
        owner = msg.sender;
        name = inputName;
        candidates.push(Candidate(candidateA,0));
        candidates.push(Candidate(candidateB,0));
        
    }
     function submitVote(uint voteVal) {
         //Index/address is contained in msg.sender
    
        require(voters[msg.sender].rights == 1);
        require(voters[msg.sender].voted == false);
        
        //Assign Vote Value to the voter
        voters[msg.sender].value = voteVal;
        //If the voter is authorized, then the vote has a state change
        candidates[voteVal].voteCount += voters[msg.sender].rights;
        
    }
    /* The invoker of the Election can convert 'citizens' into 'voters' by giving the rights variable
    / value that affects the summation in submitVote(..)*/
    function authorize(address citizen){
        require(msg.sender == owner);
        voters[citizen].rights = 1;
        
    }
    function tallyVotes() public view returns (uint candidateAResult, uint candidateBResult) {
        for(uint i=0; i < candidates.length; i++){
            AnnounceResult(candidates[i].name, candidates[i].voteCount);
        }
    }

}
