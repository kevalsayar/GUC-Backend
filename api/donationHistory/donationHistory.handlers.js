const { HelperFunction } = require("../common/helper"),
  { DonationService } = require("./donationHistory.services");

/**
 * @description Module for handling donation-related HTTP requests and responses.
 *
 * @module DonationHandlers
 */
const DonationHandlers = () => {
  /**
   * @description Handler to fetch donations based on query parameters.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const fetchDonations = async (req, res) => {
    const { query } = req;
    const response = await DonationService.donationDetails(query);
    res.status(response.code).json(response);
  };

  /**
   * @description Handler to add a new donation record.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const addDonations = async (req, res) => {
    const { body } = req;
    const response = await DonationService.addDonations(body);
    res.status(response.code).json(response);
  };

  /**
   * @description Handler to fetch the name associated with a donation by its ID.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const fetchNameForDonation = async (req, res) => {
    const { params } = req;
    const response = await DonationService.donationNameExistence(params);
    res.status(response.code).json(response);
  };

  /**
   * @description Handler to add a name for a donation and associate it with the donation ID.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const addNameForDonation = async (req, res) => {
    const { body } = req;
    body.host = HelperFunction.host(req);
    const response = await DonationService.addDonationName(body);
    res.status(response.code).json(response);
  };

  /**
   * @description Handler to get the certificate associated with a specific donation by donation ID.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const getCertificate = async (req, res) => {
    const { params } = req;
    params.host = HelperFunction.host(req);
    const response = await DonationService.certificateExistence(params);
    res.status(response.code).json(response);
  };

  return {
    fetchDonations,
    addDonations,
    fetchNameForDonation,
    addNameForDonation,
    getCertificate,
  };
};

module.exports = {
  DonationHandler: DonationHandlers(),
};
