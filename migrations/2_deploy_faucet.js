const Faucet = artifacts.require("Faucet");

module.exports = async function (deployer) {
    deployer.deploy(Faucet);
};