const Election = artifacts.require("Election");

contract("Election", accounts => {



  it("it should produce a valid Merkle Root ", async function() {
      /* Send 4 pre-defined voteKeys to the contract*/
    const instance =  await Election.deployed();
    const trueMerkle = "5060062225424388734389759152160062682747827599832181989797835757669867179676";

    return instance
          .pushVoteKey("279068567919286272405494692370356718356607598444672844562570709048854917873")
          .then(
          instance
          .pushVoteKey("19853509215178435906716469440873614721263411410499278547942821068637929368169")
          .then(
          instance
          .pushVoteKey("3181560448192751507953874194505803391543481713828825018922585520393189659867")
          .then(
          instance
          .pushVoteKey("1185539502319573937128868532294662895325164579063707179200953957722766982281")
          .then(
          instance.merkleRoot().then((chainMerkleRoot) => { 

            console.log("Chain MEerkle:" + chainMerkleRoot.valueOf());
            return assert.equal(trueMerkle, chainMerkleRoot.valueOf(), "Merkle mismatch");

          })))));
    //assert.equal(1, 2, "Merkle mismatch");
  });
    
    





});





