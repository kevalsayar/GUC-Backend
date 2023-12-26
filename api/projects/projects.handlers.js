const { ProjectService } = require("./projects.services");

/**
 * @description Module containing handlers for project-related HTTP requests.
 * @module ProjectHandlers
 */
const ProjectHandlers = () => {
  /**
   * @description Handler to fetch project details based on the provided request query parameters.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const fetchProjects = async (req, res) => {
    // Call the ProjectService to fetch project details based on the request query.
    const response = await ProjectService.projectDetails(req.query);

    // Set the HTTP response status code and send the response as JSON.
    res.status(response.code).json(response);
  };

  /**
   * @description Handler to add a new project based on the provided request body.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const addProjects = async (req, res) => {
    // Call the ProjectService to add a new project based on the request body.
    const response = await ProjectService.addProjects(req.body);

    // Set the HTTP response status code and send the response as JSON.
    res.status(response.code).json(response);
  };

  return { fetchProjects, addProjects };
};

module.exports = {
  ProjectHandler: ProjectHandlers(),
};
