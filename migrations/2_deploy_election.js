var Election = artifacts.require("./Election.sol");
/* Load Election as artifact from contract code*/
module.exports = function(deployer, network, accounts) {
    /* Deployment passes a deployer object that we pass the artifact to.
    Pass the first dummy account as the election holder*/
  deployer.deploy(Election, {from: accounts[0]});
};
