const joi = require("joi"),
  userId = joi.string().guid({ version: "uuidv4" }).label("User ID").messages({
    "any.required": "User ID is a required parameter!",
    "string.guid": "User ID is not a valid UUID!",
  }),
  projectId = joi.number().label("Project ID").messages({
    "any.required": "Project ID is a required parameter!",
    "number.base": "Project ID should be of number type!",
  }),
  donationId = joi.number().label("Donation Id").messages({
    "any.required": "Donation ID is a required parameter!",
    "number.base": "Donation ID should be of number type!",
  }),
  donationName = joi
    .string()
    .trim()
    .min(3)
    .regex(/^[a-zA-Z_ ]*$/)
    .label("Donation Name")
    .messages({
      "any.required": "Donation Name is a required parameter!",
      "string.empty": "Donation Name can not be an empty string!",
      "string.pattern.base": "Donation Name can not contain numeric values!",
      "string.min": "Donation Name length must be at least 3 characters long!",
    }),
  donationTxHash = joi
    .string()
    .regex(/^0x[a-f0-9]{64}$/)
    .label("Donation Tx Hash")
    .messages({
      "any.required": "Transaction Hash is a required parameter!",
      "string.pattern.base": "Transaction Hash is not valid!",
    }),
  category = joi
    .string()
    .label("Category")
    .messages({ "any.required": "Category is required!" }),
  search = joi.string().trim().min(3).label("Search Value").messages({
    "any.required": "Search Value is required!",
    "string.empty": "Search Value is not allowed to be empty!",
    "string.min": "Search Value length must be at least 3 characters long!",
  }),
  donationAmount = joi.number().min(1).label("Donation Amount").messages({
    "any.required": "User ID is a required parameter!",
    "number.base": "Donation Amount should be of number type!",
    "number.min": "Donation Amount must be greater than or equal to 1!",
  });

/**
 * Schemas related to donation validation.
 * @typedef {Object} DonationSchemas
 */
const DonationSchemas = function () {
  const baseUserDonationSchema = { userId: userId.required() };

  const baseDonationSchema = { donationId: donationId.required() };

  const addDonationSchema = joi.object({
    ...baseUserDonationSchema,
    projectId: projectId.required(),
    donationTxHash: donationTxHash.required(),
    donationAmount: donationAmount.required(),
  });

  const getDonationSchema = joi.object({
    ...baseUserDonationSchema,
    category: category,
    search: search,
  });

  const getNameSchema = joi.object(baseDonationSchema);

  const addNameSchema = joi.object({
    ...baseDonationSchema,
    donationName: donationName.required(),
  });

  const getCertificateSchema = joi.object(baseDonationSchema);

  return {
    addDonationSchema,
    getDonationSchema,
    getNameSchema,
    addNameSchema,
    getCertificateSchema,
  };
};

module.exports = {
  DonationSchema: DonationSchemas(),
};
