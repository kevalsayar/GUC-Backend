const { ApiError } = require("../utils/ApiError"),
  { ApiResponse } = require("../utils/ApiResponse"),
  { ProjectModel } = require("../projects/projects.model"),
  { DonationService } = require("../donationHistory/donationHistory.services"),
  { CategoryQuery } = require("./projectCategory.queries"),
  { ConstantMembers } = require("../common/members");

const CategoryServices = () => {
  /**
   * @description Service to retrieve detailed category information including associated projects.
   * @returns {Promise<object>} A Promise that resolves to an object containing detailed category information if successful.
   */
  const categoriesDetail = async () => {
    const catRes = await CategoryQuery.getCategoryGenQuery({
      attributes: {
        exclude: ["updatedAt", "createdAt", "categoryStatus"],
      },
      order: [["categoryId", "ASC"]],
      include: [{ model: ProjectModel, required: true }],
    });

    if (!catRes.length)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.Messages.request.error["inexistent-resource"]
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.request.success.info,
      {
        categoriesDetail: catRes,
      }
    );
  };

  /**
   * @description Get category details for a user's donations.
   * @param {object} userDetails - User details.
   * @returns {Promise<ApiResponse>} The API response containing category details.
   * @throws {ApiError} If there's an error in the API response.
   */
  const categoriesDetailsUser = async (userDetails) => {
    const results = await DonationService.donationDetails(userDetails);

    if (!results.status) throw new ApiError(results.code, results.message);

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.request.success.info,
      {
        categoriesDetail: [
          ...new Map(
            results?.data?.map((ele) => [
              ele.project.category.dataValues["categoryId"],
              ele.project.category.dataValues,
            ])
          ).values(),
        ],
      }
    );
  };

  /**
   * @description Add a new category to the database based on the provided category information.
   * @param {object} categoryInfo - The information of the category to be added.
   * @returns {Promise<ApiResponse>} The API response indicating success or failure.
   * @throws {ApiError} If the category already exists or if there's a bad request.
   */
  const addNewCategory = async (categoryInfo) => {
    const [_, createBool] = await CategoryQuery.createCategory(categoryInfo);

    if (!createBool)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.BAD_REQUEST,
        ConstantMembers.Messages.request.error["existent-resource"]
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.Messages.request.success.created
    );
  };

  return { categoriesDetail, addNewCategory, categoriesDetailsUser };
};

module.exports = {
  CategoryService: CategoryServices(),
};
