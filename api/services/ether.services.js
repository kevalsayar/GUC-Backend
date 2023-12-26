const ether = require("ethers");

/**
 * @module EtherFunctions
 *
 * @description EtherFunctions is a collection of utility functions for interacting with Ethereum-based networks.
 */
const EtherFunctions = () => {
  /**
   * @description This function sets up a JSON-RPC provider for the Binance Smart Chain (BSC) using the provided JSON-RPC URL.
   * @param {string} jsonRPC - The JSON-RPC URL of the BSC network.
   * @returns {object} - A JSON-RPC provider object for BSC.
   */
  const setProviderForBsc = (jsonRPC) =>
    new ether.providers.JsonRpcProvider(jsonRPC);

  /**
   * @description This function initializes a BSC contract by providing the contract address, contract ABI, JSON-RPC URL and sender's private key. It creates a contract object with a connected wallet for signing transactions.
   * @param {string} contractAddress - The address of the BSC contract.
   * @param {object} contractAbi - The ABI (Application Binary Interface) of the BSC contract.
   * @param {string} jsonRPC - The JSON-RPC URL of the BSC network.
   * @param {string} senderPrivKey - The private key of the sender's wallet.
   * @returns {object} - A BSC contract object ready for interaction.
   */
  const initializeBscContract = (
    contractAddress,
    contractAbi,
    jsonRPC,
    senderPrivKey
  ) =>
    new ether.Contract(
      contractAddress,
      contractAbi,
      setSenderWallet(senderPrivKey, setProviderForBsc(jsonRPC))
    );

  /**
   * @description This function creates a wallet object for sending transactions by using a provided private key and Ethereum provider.
   * @param {string} senderPrivKey - The private key of the sender's wallet.
   * @param {object} provider - The Ethereum provider used to connect to the blockchain.
   * @returns {object} - A wallet object that can be used to sign and send transactions.
   */
  const setSenderWallet = (senderPrivKey, provider) =>
    new ether.Wallet(senderPrivKey, provider);

  /**
   * @description This function is a utility for converting an amount to or from Wei, which is the smallest denomination of Ether in Ethereum.
   * @param {string} amount - The amount to be converted.
   * @param {string} toOrFromWei - A string indicating the direction of conversion, either 'toWei' or 'fromWei'.
   * @returns {string} - The converted amount as a string.
   */
  const weiFunctions = (amount, toOrFromWei) =>
    ether.utils[toOrFromWei](amount).toString();

  return {
    setProviderForBsc,
    initializeBscContract,
    weiFunctions,
  };
};

module.exports = {
  EtherFunction: EtherFunctions(),
};
