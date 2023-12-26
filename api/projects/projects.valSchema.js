const joi = require("joi").extend(require("@joi/date")),
  projectId = joi.number().label("Project ID").messages({
    "any.required": "Project Id is required!",
    "number.base": "Project ID should be of number type!",
  }),
  projectTitle = joi.string().label("Project Title").messages({
    "any.required": "Project Title is required!",
  }),
  projectBrief = joi
    .string()
    .label("Project Brief")
    .messages({ "any.required": "Project Brief is required!" }),
  projectContent = joi
    .string()
    .label("Project Content")
    .messages({ "any.required": "Project Content is required!" }),
  expectedDonationAmount = joi
    .number()
    .label("Expected Donation Amount")
    .messages({ "any.required": "Expected Donation Amount is required!" }),
  publishedBy = joi
    .string()
    .label("Published By")
    .messages({ "any.required": "Published By is required!" }),
  publishedDate = joi
    .date()
    .format("YYYY-MM-DD:HH:mm:SS")
    .utc()
    .label("Published Date")
    .messages({ "any.required": "Published Date is required!" }),
  category = joi.string().trim().min(1).label("Category").messages({
    "any.required": "Category is required!",
    "string.empty": "Category can not be an empty string!",
  }),
  search = joi.string().trim().min(3).label("Search Value").messages({
    "any.required": "Search Value is required!",
    "string.empty": "Search Value is not allowed to be empty!",
    "string.min": "Search Value length must be at least 3 characters long!",
  }),
  media = joi.string().label("Project Media"),
  thumbnail = joi.string().label("Project Thumbnail"),
  externalLinkTwitter = joi.string().uri().label("Twitter Link"),
  externalLinkLinkedIn = joi.string().uri().label("LinkedIn Link"),
  moduleName = joi
    .string()
    .valid("projects")
    .label("Module Name")
    .messages({ "any.required": "Module Name is required!" });

/**
 * Module containing Joi schemas for validating project-related requests.
 * @module ProjectSchemas
 */
const ProjectSchemas = () => {
  const addProjectSchema = joi.object({
    projectTitle: projectTitle.required(),
    projectBrief: projectBrief.required(),
    projectContent: projectContent.required(),
    expectedDonationAmount: expectedDonationAmount.required(),
    publishedBy: publishedBy.required(),
    publishedDate: publishedDate.required(),
    category: category.required(),
    externalLinkTwitter: externalLinkTwitter,
    externalLinkLinkedIn: externalLinkLinkedIn,
    media: media.required(),
    thumbnail: thumbnail.required(),
  });

  const moduleNameSchema = joi.object({ moduleName: moduleName.required() });

  const getProjectSchema = joi.object({
    projectId: projectId,
    category: category,
    search: search,
  });

  return {
    addProjectSchema,
    getProjectSchema,
    moduleNameSchema,
  };
};

module.exports = {
  projectSchemas: ProjectSchemas(),
};
