const BlockSecureDeployer = artifacts.require("BlockSecureDeployer")
module.exports = function(deployer) {
    deployer.deploy(BlockSecureDeployer)
}