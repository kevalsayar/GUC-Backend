const { ConstantMembers } = require("../common/members"),
  { ApiError } = require("../utils/ApiError"),
  { DonationHistoryModel } = require("./donationHistory.model"),
  { UserQuery } = require("../user/user.queries"),
  { ProjectQuery } = require("../projects/projects.queries"),
  { HelperFunction } = require("../common/helper");

const DonationQueries = () => {
  /**
   * @description Creates a donation record and associates it with a user and project.
   * @param {Object} donationDetails - Details of the donation to create.
   * @param {number} donationDetails.userId - The ID of the user making the donation.
   * @param {number} donationDetails.projectId - The ID of the project associated with the donation.
   * @param {number} donationDetails.donationAmount - The amount of the donation.
   * @param {string} donationDetails.donationTxHash - The transaction hash of the donation.
   * @returns {Promise<Object|false>} - A promise that resolves to an object containing donationResults and userResults if successful, or false if unsuccessful.
   */
  const createDonation = async (donationDetails) =>
    await HelperFunction.runTransaction(async (transaction) => {
      const userResults = await UserQuery.getSingleUser(
        "id",
        donationDetails.userId
      );

      const projectResults = await ProjectQuery.getProjectsGenQuery({
        where: { projectId: donationDetails.projectId },
      });

      if (!userResults || !projectResults.length) {
        throw new ApiError(
          ConstantMembers.STATUS_CODE.NOT_FOUND,
          ConstantMembers.Messages.request.error["inexistent-resource"]
        );
      }

      const results = await userResults.createDonation_history(
        {
          donationAmount: donationDetails.donationAmount,
          donationTxHash: donationDetails.donationTxHash,
        },
        { transaction }
      );

      await projectResults[0].addDonation_history(results, { transaction });

      return { donationResults: results, userResults: userResults };
    });

  /**
   * @description Retrieves donation records based on the provided query attributes.
   * @param {Object} findAllAttr - Attributes for querying donation records.
   * @param {Object} findAllAttr.where - The WHERE clause for filtering records.
   * @param {Object} findAllAttr.attributes - The attributes to include in the result.
   * @param {Array} findAllAttr.order - The sorting order for the result.
   * @param {Object} findAllAttr.include - Associations to include in the query.
   * @returns {Promise<Array|null>} - A promise that resolves to an array of donation records or null if no records are found.
   */
  const fetchDonationsGenQuery = async (findAllAttr) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await DonationHistoryModel.findAll(findAllAttr, transaction)
    );

  /**
   * @description Adds a certificate name to a donation record and generates a certificate ID.
   * @param {Object} donationDetails - Details of the donation for which to add a certificate name.
   * @param {string} donationDetails.donationName - The name to be added to the certificate.
   * @param {Object} findAllAttr - Additional attributes for finding the donation record.
   * @returns {Promise<Object|false>} - A promise that resolves to the updated donation record if successful, or false if unsuccessful.
   */
  const addCertificateName = async (donationDetails) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await DonationHistoryModel.update(
          {
            nameOnCertificate: donationDetails.donationName,
            certificateId:
              new Date().getTime().toString(36) +
              Math.random().toString(36).slice(2),
            certificateCreationAt: Date.now(),
          },
          { where: { donationId: donationDetails.donationId } },
          transaction
        )
    );

  return {
    createDonation,
    addCertificateName,
    fetchDonationsGenQuery,
  };
};

module.exports = {
  DonationQuery: DonationQueries(),
};
