const { CategoryModel } = require("./projectCategory.model"),
  { HelperFunction } = require("../common/helper");

const CategoryQueries = () => {
  /**
   * @description Create a new category in the database or find an existing one with the same title.
   * @param {object} categoryDetails - The details of the category to create or find.
   * @returns {Promise<[CategoryModel, boolean]>} A Promise that resolves to an array containing the category model and a boolean indicating whether the category was created or found.
   */
  const createCategory = async (categoryDetails) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await CategoryModel.findOrCreate({
          where: { categoryTitle: categoryDetails.categoryTitle },
          defaults: { ...categoryDetails },
          transaction: transaction, // Associate the transaction with this operation.
        })
    );

  /**
   * @description Retrieve categories from the database based on the provided query attributes.
   * @param {object} findAllAttr - Attributes for querying categories.
   * @returns {Promise<object[]|boolean>} A Promise that resolves to an array of retrieved categories if successful, or false if no categories are found.
   */
  const getCategoryGenQuery = async (findAllAttr) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await CategoryModel.findAll(findAllAttr, transaction)
    );

  return {
    createCategory,
    getCategoryGenQuery,
  };
};

module.exports = {
  CategoryQuery: CategoryQueries(),
};
