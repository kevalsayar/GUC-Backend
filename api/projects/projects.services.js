const { ApiResponse } = require("../utils/ApiResponse"),
  { ApiError } = require("../utils/ApiError"),
  { Op } = require("sequelize"),
  { CategoryModel } = require("../projectCategory/projectCategory.model"),
  { ProjectQuery } = require("./projects.queries"),
  { ConstantMembers } = require("../common/members");

const ProjectServices = () => {
  /**
   * @description Service to retrieve project details based on the provided request object, including search criteria, category, and project ID.
   * @param {object} requestObject - The request object containing search criteria, category, and project ID.
   * @param {string} requestObject.search - The search string used to filter project titles and brief descriptions.
   * @param {string} requestObject.category - The category used to filter projects.
   * @param {number} requestObject.projectId - The ID of a specific project to retrieve.
   * @returns {Promise<object>} A Promise that resolves to an object containing project details if successful, or an error response if there was an issue.
   */
  const projectDetails = async (requestObject) => {
    let projectDetails;

    // Define default query options.
    const attributes = {
      exclude: ["categoryId"],
    };

    const order = [["publishedDate", "DESC"]];

    // Define the search criteria for the "where" clause.
    const where = {
      [Op.or]: [
        {
          projectTitle: {
            [Op.like]: `%${requestObject.search}%`,
          },
        },
        {
          projectBrief: {
            [Op.like]: `%${requestObject.search}%`,
          },
        },
      ],
    };

    // Define the inclusion of the CategoryModel if "category" is provided.
    const include = {
      model: CategoryModel,
      where: { categoryTitle: requestObject.category },
      attributes: {
        exclude: ["categoryId", "categoryTitle", "categoryStatus", "createdAt"],
      },
    };

    // Construct the query based on the requestObject.
    if (requestObject.category && requestObject.search) {
      projectDetails = await ProjectQuery.getProjectsGenQuery({
        where: where,
        attributes: attributes,
        order: order,
        include: include,
      });
    } else if (requestObject.category) {
      projectDetails = await ProjectQuery.getProjectsGenQuery({
        attributes: attributes,
        order: order,
        include: include,
      });
    } else if (requestObject.search) {
      projectDetails = await ProjectQuery.getProjectsGenQuery({
        where: where,
        attributes: attributes,
        order: order,
      });
    } else if (requestObject.projectId) {
      projectDetails = await ProjectQuery.getProjectsGenQuery({
        where: { projectId: requestObject.projectId },
      });
    } else {
      projectDetails = await ProjectQuery.getProjectsGenQuery({
        order: order,
      });
    }

    if (!projectDetails.length)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.Messages.request.error["inexistent-resource"]
      );

    // Return a successful ApiResponse with projectDetails.
    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.request.success.info,
      {
        projectDetails: projectDetails,
      }
    );
  };

  /**
   * @description Service to add a new project to the database based on the provided project details.
   * @param {object} projectDetails - The details of the project to be added.
   * @param {string} projectDetails.category - The category of the project.
   * @param {string} projectDetails.otherDetails - Other details of the project.
   * @returns {Promise<object>} A Promise that resolves to a response object indicating success or an error if there was an issue.
   */
  const addProjects = async (projectDetails) => {
    await ProjectQuery.addProjectsQuery(projectDetails);

    // If the project was added successfully, return a successful ApiResponse.
    return new ApiResponse(
      ConstantMembers.STATUS_CODE.CREATED,
      ConstantMembers.Messages.request.success.created
    );
  };

  return { projectDetails, addProjects };
};

module.exports = {
  ProjectService: ProjectServices(),
};
