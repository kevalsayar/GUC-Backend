const { ConstantMembers } = require("../common/members"),
  { CategoryQuery } = require("../projectCategory/projectCategory.queries"),
  { ProjectModel } = require("./projects.model"),
  { HelperFunction } = require("../common/helper"),
  { ApiError } = require("../utils/ApiError");

/**
 * @description Module containing database queries related to projects.
 * @module ProjectQueries
 */
const ProjectQueries = () => {
  /**
   * @description Adds a new project to the database based on the provided project details.
   * @param {object} projectDetails - The details of the project to be added.
   * @param {string} projectDetails.category - The category of the project.
   * @param {string} projectDetails.otherDetails - Other details of the project.
   * @returns {Promise<boolean|object>} A Promise that resolves to the added project object if successful, or false if there was an error.
   */
  const addProjectsQuery = async (projectDetails) =>
    await HelperFunction.runTransaction(async (transaction) => {
      const catRes = await CategoryQuery.getCategoryGenQuery({
        where: { categoryTitle: projectDetails.category },
      });

      if (!catRes.length) {
        throw new ApiError(
          ConstantMembers.STATUS_CODE.NOT_FOUND,
          ConstantMembers.Messages.request.error["inexistent-resource"]
        );
      }

      catRes[0].createProject(
        {
          ...projectDetails,
        },
        { transaction }
      );
    });

  /**
   * @description Retrieves projects from the database based on the provided query attributes.
   * @param {object} findAllAttr - Attributes for querying projects.
   * @param {object} findAllAttr.where - Conditions for filtering projects.
   * @param {string[]} findAllAttr.attributes - Attributes to select from the projects.
   * @param {object[]} findAllAttr.order - Sorting order for the retrieved projects.
   * @param {object[]} findAllAttr.include - Associations to include in the query.
   * @returns {Promise<object[]|boolean>} A Promise that resolves to an array of retrieved projects if successful, or false if no projects are found.
   */
  const getProjectsGenQuery = async (findAllAttr) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await ProjectModel.findAll(findAllAttr, transaction)
    );

  /**
   * @description Updates project details in the database based on the provided project details.
   * @param {object} projectDetails - The details of the project to be updated.
   * @param {number} projectDetails.projectId - The ID of the project to update.
   * @param {number} projectDetails.donationAmount - The amount of the donation to be added to the project.
   * @returns {Promise<boolean>} A Promise that resolves to true if the update was successful, or false if there was an error or no project was found with the given ID.
   */
  const updateProjectDetails = async (projectDetails) =>
    await HelperFunction.runTransaction(async (transaction) => {
      const projectResults = await ProjectModel.findByPk(
        projectDetails.projectId,
        { raw: true },
        { transaction: transaction }
      );

      return (
        await ProjectModel.update(
          {
            totalDonations: projectResults.totalDonations + 1,
            amountRaised:
              parseInt(projectResults.amountRaised) +
              parseInt(projectDetails.donationAmount),
            latestDonationTime: Date.now(),
          },
          {
            where: {
              projectId: projectDetails.projectId,
            },
          },
          transaction
        )
      )[0];
    });

  return {
    addProjectsQuery,
    updateProjectDetails,
    getProjectsGenQuery,
  };
};

module.exports = {
  ProjectQuery: ProjectQueries(),
};
