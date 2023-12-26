/**
 * Blockchain Transfer Event Emitter
 *
 * This module defines an event emitter that handles the transfer of GUC (a blockchain-based token) to a specified wallet address.
 * It listens for the "transfer-BETAGUC" event and initiates the transfer when triggered.
 */
const { ConstantMembers } = require("../common/members"),
  { NUM_GUC_TO_TRANSFER } = require("../config/env"),
  { HelperFunction } = require("../common/helper"),
  { contract } = require("../config/blockchain.config"),
  { EtherFunction } = require("../services/ether.services");

const em = new (require("events").EventEmitter)();

em.on("transfer-BETAGUC", async (walletAddress) => {
  const amountInEther = EtherFunction.weiFunctions(
    NUM_GUC_TO_TRANSFER,
    ConstantMembers.ETHERS_WEI_CONSTANTS.TO_WEI
  );

  if (
    parseInt(amountInEther) <
    parseInt((await contract.balanceOf(await contract.owner())).toString())
  ) {
    const tx = await contract.transfer(walletAddress, amountInEther.toString());

    const res = await tx.wait();

    if (res.status)
      HelperFunction.loggerInfo({
        message: `Sent ${amountInEther} GUC to ${walletAddress}`,
      });
  } else {
    HelperFunction.loggerError(
      {
        message: ConstantMembers.Messages.gucToken["insufficient-tokens"],
      },
      currentFileName
    );
  }
});

module.exports = { em };
