/**
 * @module BSCContract
 * 
 * @description Initializes and exports a Binance Smart Chain (BSC) contract instance.
 */
const { EtherFunction } = require("../services/ether.services"),
  GUCTokenAbi = require("../../contracts/bsc/abi/guc.json"),
  { GUC_TOKEN_ADDRESS, BSCT_JSON_RPC_URL, PRIVATE_KEY } = require("./env");

const contract = EtherFunction.initializeBscContract(
  GUC_TOKEN_ADDRESS,
  GUCTokenAbi,
  BSCT_JSON_RPC_URL,
  PRIVATE_KEY
);

module.exports = {
  contract,
};
