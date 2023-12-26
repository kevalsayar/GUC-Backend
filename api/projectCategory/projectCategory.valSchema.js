const joi = require("joi"),
  categoryTitle = joi.string().min(3).label("Category Title").messages({
    "any.required": "Category Title is a required parameter!",
  }),
  userId = joi
    .string()
    .guid({ version: "uuidv4" })
    .label("User UUID")
    .messages({
      "any.required": "User UUID is a required parameter!",
    });

/**
 * Module for defining validation schemas related to categories.
 *
 * @module CategoryValidationSchemas
 */
const categoryValSchemas = () => {
  const addCategorySchema = joi.object({
    categoryTitle: categoryTitle.required(),
  });

  const getUserCategorySchema = joi.object({
    userId: userId.required(),
  });

  return { addCategorySchema, getUserCategorySchema };
};

module.exports = {
  categorySchemas: categoryValSchemas(),
};
