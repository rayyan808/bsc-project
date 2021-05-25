const MiMC_hash = artifacts.require('MiMC_hash.sol');
const MiMCpe7_generated = artifacts.require('MiMCpe7_generated.sol');

module.exports = function(deployer) {
	return deployer.then( async () => {
		await deployer.link(MiMCpe7_generated, MiMC_hash);
		await deployer.deploy(MiMC_hash);
	});
	
};