const { ApiError } = require("../utils/ApiError"),
  { ApiResponse } = require("../utils/ApiResponse"),
  { CERTIFICATE_UPLOAD } = require("../config/env"),
  { Op, fn, col } = require("sequelize"),
  { CategoryModel } = require("../projectCategory/projectCategory.model"),
  { ProjectModel } = require("../projects/projects.model"),
  { ProjectQuery } = require("../projects/projects.queries"),
  { UserQuery } = require("../user/user.queries"),
  { HelperFunction } = require("../common/helper"),
  { DonationQuery } = require("./donationHistory.queries"),
  { UtilFunction } = require("../common/utils"),
  { ConstantMembers } = require("../common/members");

const DonationServices = () => {
  /**
   * @description Service to fetch donation details based on the provided query parameters.
   * @param {Object} donationDetails - The query parameters for fetching donation details.
   * @param {number} donationDetails.userId - The user ID for which donations are to be fetched.
   * @param {string} [donationDetails.category] - The category to filter donations (optional).
   * @param {string} [donationDetails.search] - The search query to filter donations (optional).
   * @returns {Promise<Object>} - A promise that resolves to a response object containing donation details.
   */
  const donationDetails = async (donationDetails) => {
    let donationResults;
    const where = { userId: donationDetails.userId };

    const attributes = {
      exclude: ["userId", "createdAt", "projectId"],
    };

    const order = [["createdAt", "DESC"]];

    let genInclude;

    if (donationDetails.category && donationDetails.search) {
      let genInclude = [
        {
          model: ProjectModel,
          required: true,
          where: {
            [Op.or]: [
              {
                projectTitle: {
                  [Op.like]: `%${donationDetails.search}%`,
                },
              },
              {
                projectBrief: {
                  [Op.like]: `%${donationDetails.search}%`,
                },
              },
            ],
          },
          include: [
            {
              model: CategoryModel,
              where: { categoryTitle: donationDetails.category },
            },
          ],
        },
      ];
      donationResults = await DonationQuery.fetchDonationsGenQuery({
        where: where,
        attributes: attributes,
        order: order,
        include: genInclude,
      });
    } else if (donationDetails.category) {
      let genInclude = [
        {
          model: ProjectModel,
          required: true,
          include: [
            {
              model: CategoryModel,
              where: { categoryTitle: donationDetails.category },
            },
          ],
        },
      ];

      donationResults = await DonationQuery.fetchDonationsGenQuery({
        where: where,
        attributes: attributes,
        order: order,
        include: genInclude,
      });
    } else if (donationDetails.search) {
      let genInclude = [
        {
          model: ProjectModel,
          required: true,
          where: {
            [Op.or]: [
              {
                projectTitle: {
                  [Op.like]: `%${donationDetails.search}%`,
                },
              },
              {
                projectBrief: {
                  [Op.like]: `%${donationDetails.search}%`,
                },
              },
            ],
          },
        },
      ];

      donationResults = await DonationQuery.fetchDonationsGenQuery({
        where: where,
        attributes: attributes,
        order: order,
        include: genInclude,
      });
    } else {
      let genInclude = [
        {
          model: ProjectModel,
          required: true,
          include: [
            {
              model: CategoryModel,
              attributes: {
                exclude: ["createdAt", "categoryStatus"],
              },
            },
          ],
        },
      ];

      donationResults = await DonationQuery.fetchDonationsGenQuery({
        where: where,
        attributes: attributes,
        order: order,
        include: genInclude,
      });
    }

    if (!donationResults.length)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.Messages.request.error["inexistent-resource"]
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.request.success.info,
      donationResults
    );
  };

  /**
   * @description Service add a new donation record and updates user and project details.
   * @param {Object} donationDetails - The details of the donation to be added.
   * @param {number} donationDetails.userId - The ID of the donating user.
   * @param {number} donationDetails.donationAmount - The amount of the donation.
   * @param {string} donationDetails.donationTxHash - The transaction hash of the donation.
   * @returns {Promise<Object>} - A promise that resolves to a response object indicating the result of the donation addition.
   */
  const addDonations = async (donationDetails) => {
    const { donationResults, userResults } = await DonationQuery.createDonation(
      donationDetails
    );

    if (
      (
        await UserQuery.userRecordsUpdate(
          donationDetails.userId,
          "carbon_credits",
          parseInt(userResults.carbon_credits) +
            parseInt(donationDetails.donationAmount)
        )
      )[0]
    ) {
      if (await ProjectQuery.updateProjectDetails(donationDetails)) {
        return new ApiResponse(
          ConstantMembers.STATUS_CODE.CREATED,
          ConstantMembers.Messages.request.success.created,
          { donationDetails: donationResults }
        );
      }
    }
  };

  /**
   * @description Service to check if a name exists for a specific donation and retrieves it.
   * @param {Object} donationDetails - The details of the donation to check the name for.
   * @param {number} donationDetails.donationId - The ID of the donation to check.
   * @returns {Promise<Object>} - A promise that resolves to a response object indicating the result of the name existence check.
   */
  const donationNameExistence = async (donationDetails) => {
    const where = { donationId: donationDetails.donationId };

    const attributes = [
      "donationAmount",
      "nameOnCertificate",
      "certificateId",
      [
        fn("DATE_FORMAT", col("certificateCreationAt"), "%M %D %Y"),
        "certificateCreationAt",
      ],
    ];

    const include = {
      model: ProjectModel,
    };

    const result = await DonationQuery.fetchDonationsGenQuery({
      where: where,
      attributes: attributes,
      include: include,
    });

    if (!result.length)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.Messages.request.error["inexistent-resource"]
      );

    if (!result[0].nameOnCertificate)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        "Name does not exist for donation!"
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      "Name exists for donation!",
      { donationName: result[0].nameOnCertificate }
    );
  };

  /**
   * @description Service to add a name to a donation certificate and generates a PDF certificate.
   * @param {Object} donationDetails - The details of the donation certificate to add a name to.
   * @param {number} donationDetails.donationId - The ID of the donation certificate to update.
   * @param {string} donationDetails.donationName - The name to add to the certificate.
   * @param {string} donationDetails.host - The host information for generating the PDF certificate.
   * @returns {Promise<Object>} - A promise that resolves to a response object indicating the result of the name addition.
   */
  const addDonationName = async (donationDetails) => {
    const where = { donationId: donationDetails.donationId };

    if (
      (await DonationQuery.fetchDonationsGenQuery({ where: where }))[0]
        .nameOnCertificate
    ) {
      throw new ApiError(
        ConstantMembers.STATUS_CODE.BAD_REQUEST,
        "Name exists!"
      );
    }

    const attributes = [
      "donationAmount",
      "nameOnCertificate",
      "certificateId",
      [
        fn("DATE_FORMAT", col("certificateCreationAt"), "%M %D %Y"),
        "certificateCreationAt",
      ],
    ];

    const include = {
      model: ProjectModel,
    };

    const findAllAttr = {
      where: where,
      attributes: attributes,
      include: include,
    };

    donationDetails.donationName = HelperFunction.toPascalCase(
      donationDetails.donationName
    ).trim();

    const addNameRes = await DonationQuery.addCertificateName(donationDetails);

    if (addNameRes[0]) {
      const donationsRes = (
        await DonationQuery.fetchDonationsGenQuery(findAllAttr)
      )[0];

      if (
        await UtilFunction.generateDonationCertiPDF({
          name: donationsRes.nameOnCertificate,
          amount: donationsRes.donationAmount,
          projectName: donationsRes.project.projectTitle,
          date: donationsRes.certificateCreationAt,
          certificateId: donationsRes.certificateId,
          host: donationDetails.host,
        })
      )
        return new ApiResponse(
          ConstantMembers.STATUS_CODE.SUCCESS,
          ConstantMembers.Messages.request.success.updated,
          { donationDetails: donationsRes }
        );
    }
  };

  /**
   * @description Checks if a certificate exists for a given donation and returns the certificate URL
   * @param {Object} donationDetails - The details of the donation certificate to check.
   * @param {number} donationDetails.donationId - The ID of the donation certificate to check.
   * @param {string} donationDetails.host - The host information for constructing the certificate URL.
   * @returns {Promise<Object>} - A promise that resolves to a response object indicating the certificate's existence and URL.
   */
  const certificateExistence = async (donationDetails) => {
    const certificateResults = await DonationQuery.fetchDonationsGenQuery({
      where: { donationId: donationDetails.donationId },
    });

    if (!certificateResults.length || !certificateResults[0]?.certificateId)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.Messages.request.error["inexistent-resource"]
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.request.success.info,
      {
        donationURL:
          donationDetails.host +
          `${CERTIFICATE_UPLOAD}/` +
          `${certificateResults[0].certificateId}.pdf`,
      }
    );
  };

  return {
    donationDetails,
    addDonations,
    donationNameExistence,
    addDonationName,
    certificateExistence,
  };
};

module.exports = {
  DonationService: DonationServices(),
};
