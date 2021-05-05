var Election = artifacts.require("./Election.sol");
/* Load Election as artifact from contract code*/
module.exports = function(deployer) {
    /* Deployment passes a deployer object that we pass the artifact to*/
  deployer.deploy(Election);
};
