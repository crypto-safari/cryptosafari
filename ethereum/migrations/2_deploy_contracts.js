var contract = artifacts.require("./token.sol");

module.exports = function(deployer) {
  deployer.deploy(contract, "crypto-safari", "CSF");
};
