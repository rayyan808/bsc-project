var MiMC = artifacts.require("./MiMC.sol");
/* Load MiMC as artifact from contract code*/
module.exports = function(deployer, network, accounts) {
    /* Deployment passes a deployer object that we pass the artifact to.
    Pass the first dummy account as the election holder*/
  deployer.deploy(MiMC /*, {from: accounts[0]}*/);
};
