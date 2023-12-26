const { CategoryService } = require("./projectCategory.services");

const CategoryHandlers = () => {
  /**
   * @description Handler to fetch all category details.
   * @param {import("express").Request} request - Express request object.
   * @param {import("express").Response} response - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the response is sent.
   */
  const fetchAllCategory = async (request, response) => {
    const result = await CategoryService.categoriesDetail();
    response.status(result.code).json(result);
  };

  /**
   * @description Handler to add a new category based on the provided request body.
   * @param {import("express").Request} request - Express request object.
   * @param {import("express").Response} response - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the result is sent.
   */
  const addCategory = async (request, response) => {
    const { body } = request;
    const result = await CategoryService.addNewCategory(body);
    response.status(result.code).json(result);
  };

  /**
   * @description Handler to fetch category details for a user based on the provided request parameters.
   * @param {import("express").Request} request - Express request object.
   * @param {import("express").Response} response - Express response object.
   * @returns {Promise<void>} A Promise that resolves once the result is sent.
   */
  const fetchCategoryForUser = async (request, response) => {
    const { params } = request;
    const result = await CategoryService.categoriesDetailsUser(params);
    response.status(result.code).json(result);
  };

  return { fetchAllCategory, addCategory, fetchCategoryForUser };
};

module.exports = {
  CategoryHandler: CategoryHandlers(),
};
