var VerifySig = artifacts.require("VerifySig");

module.exports = async function(deployer) {
  await deployer.deploy(VerifySig);
};